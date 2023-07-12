import { S3, S3Bucket, Status, PDFDocument, StandardFonts } from '../deps.ts';
import Context from '../interfaces/context.interface.ts';
import FiltrosRelatorioBackup from '../interfaces/filtrosRelatorioBackup.interface.ts';
import ClienteBackupData from '../interfaces/clienteBackupData.interface.ts';
import { REGEX_DD_MM_YYYY } from '../utils/regex.ts';
import { parseDD_MM_YYYYToDate, parseYYYYMMDDtoDate, formatDateToDDMMYYYY, formatDateToDDMMYYYYhhmm } from '../utils/date.ts';
import backupConfigService from '../services/backupConfig.service.ts';
import clienteService from '../services/cliente.service.ts';
import Cliente from '../models/cliente.model.ts';
import { OpcaoRelatorioBackupEnum } from '../enums/opcaoRelatorioBackup.enum.ts';
import 'https://deno.land/x/dotenv@v3.2.0/load.ts';

class RelatorioBackupController {

  geraRelatorioBackup = async ({ request, response }: Context) => {
    if (!request.hasBody) {
      response.status = Status.BadRequest;
      response.body = { message: "Dados de Relatório de Backups inválidos" };
      return;
    }

    const filtros: FiltrosRelatorioBackup = await request.body().value;
    if (filtros.dataInicial) {
      filtros.dataInicial = parseYYYYMMDDtoDate(String(filtros.dataInicial));
    }
    if (filtros.dataFinal) {
      filtros.dataFinal = parseYYYYMMDDtoDate(String(filtros.dataFinal));
    }

    const s3 = new S3({
      accessKeyID: Deno.env.get('S3_ACCESS_KEY') || '',
      secretKey: Deno.env.get('S3_SECRET_KEY') || '',
      region: Deno.env.get('S3_REGION') || '',
      endpointURL: Deno.env.get('S3_ENDPOINT_URL')
    });
  
    const bucket = s3.getBucket('backuplogpro');

    const clientesBackupData: ClienteBackupData[] = [];

    if (filtros.idCliente == 0) {
      const clientes = await clienteService.getAll();
      for (let cliente of clientes) {
        const clienteBackupData = await this.getClienteBackupData(cliente, filtros, bucket);
        clientesBackupData.push(clienteBackupData);
      }
    } else {
      try {
        const cliente = await clienteService.getById(Number(filtros.idCliente));
        const clienteBackupData = await this.getClienteBackupData(cliente, filtros, bucket);
        clientesBackupData.push(clienteBackupData);
      } catch (error) {
        response.status = Status.NotFound;
        response.body = { message: error?.message };
        return;
      }
    }
    
    const pdf = await this.criaPdf(clientesBackupData, filtros.opcao);

    response.headers.set('Content-Type', 'application/pdf');
    response.headers.set('Content-Length', String(pdf.byteLength));
    response.body = pdf;
  }

  getClienteBackupData = async (cliente: Cliente, filtros: FiltrosRelatorioBackup, bucket: S3Bucket) => {
    let datasExistentes: any[] = [];
    let datasInexistentes: any[] = [];
    const backupConfigs = await backupConfigService.getByClienteId(Number(cliente.id));
    for (let backup of backupConfigs) {
      if (!backup.nomediretorionuvem) {
        continue;
      }
      const list = await bucket.listObjects({ prefix: `${backup.nomediretorionuvem}/` });
      if (!list?.contents) {
        continue;
      }

      const listDates: string[] = [];

      for (let item of list.contents) {
        if (item.key?.includes('.backup') || item.key?.includes('.rar') || item.key?.includes('.zip')) {
          const match = item.key?.match(REGEX_DD_MM_YYYY);
          if (match) {
            const date = parseDD_MM_YYYYToDate(match[0]);
            if (date >= filtros.dataInicial && date <= filtros.dataFinal) {
              listDates.push(formatDateToDDMMYYYY(date));
            }
          }
        }
      }
      let dataInicial = new Date(filtros.dataInicial);
      let todasDatas: string[] = [];
      if (formatDateToDDMMYYYY(dataInicial) === formatDateToDDMMYYYY(new Date(filtros.dataFinal))) {
        todasDatas.push(formatDateToDDMMYYYY(dataInicial))
      } else {
        todasDatas.push(formatDateToDDMMYYYY(dataInicial));
        let obteveTodasDatas = false;
        while (!obteveTodasDatas) {
          dataInicial.setDate(dataInicial.getDate() + 1);
          todasDatas.push(formatDateToDDMMYYYY(dataInicial));
          if (formatDateToDDMMYYYY(dataInicial) === formatDateToDDMMYYYY(new Date(filtros.dataFinal))) {
            obteveTodasDatas = true;
          }
        }
      }
      for (let data of todasDatas) {
        if (listDates.includes(data)) {
          datasExistentes.push(data);
        } else {
          datasInexistentes.push(data);
        }
      }
    }
    const clienteBackupData: ClienteBackupData = {
      cliente,
      datasExistentes,
      datasInexistentes
    };

    return clienteBackupData;
  }

  criaPdf = async (clientesBackupData: ClienteBackupData[], opcaoRelatorio: string): Promise<Uint8Array> => {
    const pdfDoc = await PDFDocument.create();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const MIN_VALUE_Y = 60;
    const INITIAL_VALUE_Y = 800;
    for (let clienteBackupData of clientesBackupData) {
      let page = pdfDoc.addPage();
      let textSize = 18;
      let initialY = 800;
      // Escreve o nome do Cliente no PDF
      page.drawText(String(clienteBackupData.cliente.nome), {
        x: page.getWidth() / 2 - helveticaFont.widthOfTextAtSize(String(clienteBackupData.cliente.nome), textSize) / 2,
        y: initialY,
        size: textSize,
        font: helveticaFont,
      });
      textSize = 14;
      initialY -= 30;
      // Escreve a data de emissão no PDF
      let text = `Emitido em: ${formatDateToDDMMYYYYhhmm(new Date())}`;
      page.drawText(text, {
        x: page.getWidth() / 2 - helveticaFont.widthOfTextAtSize(text, textSize) / 2,
        y: initialY,
        size: textSize,
        font: helveticaFont,
      });
      initialY -= 40;
      // Se opção for apenas EXISTENTES
      if (opcaoRelatorio === OpcaoRelatorioBackupEnum.EXISTENTES) {
        text = 'Existentes'
        page.drawText(text, {
          x: page.getWidth() / 2 - helveticaFont.widthOfTextAtSize(text, textSize) / 2,
          y: initialY,
          size: textSize,
          font: helveticaFont,
        });
        textSize = 12;
        initialY -= 30;
        for (let dataExistente of clienteBackupData.datasExistentes) {
          if (initialY <= MIN_VALUE_Y) {
            page = pdfDoc.addPage();
            initialY = INITIAL_VALUE_Y;
          }
          page.drawText(dataExistente, {
            x: page.getWidth() / 2 - helveticaFont.widthOfTextAtSize(dataExistente, textSize) / 2,
            y: initialY,
            size: textSize,
            font: helveticaFont,
          });
          initialY -= 15;
        }
        initialY -= 30;
      }
      // Se opção for apenas INEXISTENTES 
      else if (opcaoRelatorio === OpcaoRelatorioBackupEnum.INEXISTENTES) {
        textSize = 14;
        text = 'Inexistentes'
        page.drawText(text, {
          x: page.getWidth() / 2 - helveticaFont.widthOfTextAtSize(text, textSize) / 2,
          y: initialY,
          size: textSize,
          font: helveticaFont,
        });
        textSize = 12;
        initialY -= 30;
        for (let dataInexistente of clienteBackupData.datasInexistentes) {
          if (initialY <= MIN_VALUE_Y) {
            page = pdfDoc.addPage();
            initialY = INITIAL_VALUE_Y;
          }
          page.drawText(dataInexistente, {
            x: page.getWidth() / 2 - helveticaFont.widthOfTextAtSize(dataInexistente, textSize) / 2,
            y: initialY,
            size: textSize,
            font: helveticaFont,
          });
          initialY -= 15;
        }
        initialY -= 30;
      } 
      // Se opção for AMBOS
      else {
        text = 'Existentes'
        page.drawText(text, {
          x: page.getWidth() / 2 - helveticaFont.widthOfTextAtSize(text, textSize) / 2,
          y: initialY,
          size: textSize,
          font: helveticaFont,
        });
        textSize = 12;
        initialY -= 30;
        for (let dataExistente of clienteBackupData.datasExistentes) {
          if (initialY <= MIN_VALUE_Y) {
            page = pdfDoc.addPage();
            initialY = INITIAL_VALUE_Y;
          }
          page.drawText(dataExistente, {
            x: page.getWidth() / 2 - helveticaFont.widthOfTextAtSize(dataExistente, textSize) / 2,
            y: initialY,
            size: textSize,
            font: helveticaFont,
          });
          initialY -= 15;
        }
        initialY -= 30;
        textSize = 14;
        text = 'Inexistentes'
        page.drawText(text, {
          x: page.getWidth() / 2 - helveticaFont.widthOfTextAtSize(text, textSize) / 2,
          y: initialY,
          size: textSize,
          font: helveticaFont,
        });
        textSize = 12;
        initialY -= 30;
        for (let dataInexistente of clienteBackupData.datasInexistentes) {
          if (initialY <= MIN_VALUE_Y) {
            page = pdfDoc.addPage();
            initialY = INITIAL_VALUE_Y;
          }
          page.drawText(dataInexistente, {
            x: page.getWidth() / 2 - helveticaFont.widthOfTextAtSize(dataInexistente, textSize) / 2,
            y: initialY,
            size: textSize,
            font: helveticaFont,
          });
          initialY -= 15;
        }
        initialY -= 30;
      }
      textSize = 14;
      // Se opção for apenas EXISTENTES 
      if (opcaoRelatorio === OpcaoRelatorioBackupEnum.EXISTENTES) {
        if (initialY <= MIN_VALUE_Y) {
          page = pdfDoc.addPage();
          initialY = INITIAL_VALUE_Y;
        }
        // Escreve a quantidade de EXISTENTES do PDF
        text = `Qtd Existentes: ${clienteBackupData.datasExistentes.length}`
        page.drawText(text, {
          x: page.getWidth() / 2 - helveticaFont.widthOfTextAtSize(text, textSize) / 2,
          y: initialY,
          size: textSize,
          font: helveticaFont,
        });
        initialY -= 20;
      } 
      // Se opção for apenas INEXISTENTES 
      else if (opcaoRelatorio === OpcaoRelatorioBackupEnum.INEXISTENTES) {
        if (initialY <= MIN_VALUE_Y) {
          page = pdfDoc.addPage();
          initialY = INITIAL_VALUE_Y;
        }
        // Escreve a quantidade de INEXISTENTES do PDF
        text = `Qtd Inexistentes: ${clienteBackupData.datasInexistentes.length}`
        page.drawText(text, {
          x: page.getWidth() / 2 - helveticaFont.widthOfTextAtSize(text, textSize) / 2,
          y: initialY,
          size: textSize,
          font: helveticaFont,
        });
      } 
      // Se opção for apenas AMBOS
      else {
        if (initialY <= MIN_VALUE_Y) {
          page = pdfDoc.addPage();
          initialY = INITIAL_VALUE_Y;
        }
        // Escreve a quantidade de EXISTENTES do PDF
        text = `Qtd Existentes: ${clienteBackupData.datasExistentes.length}`
        page.drawText(text, {
          x: page.getWidth() / 2 - helveticaFont.widthOfTextAtSize(text, textSize) / 2,
          y: initialY,
          size: textSize,
          font: helveticaFont,
        });
        initialY -= 20;
        // Escreve a quantidade de INEXISTENTES do PDF
        text = `Qtd Inexistentes: ${clienteBackupData.datasInexistentes.length}`
        page.drawText(text, {
          x: page.getWidth() / 2 - helveticaFont.widthOfTextAtSize(text, textSize) / 2,
          y: initialY,
          size: textSize,
          font: helveticaFont,
        });
      }
    }
    return await pdfDoc.save();
  }
}

export default new RelatorioBackupController();