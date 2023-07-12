# clientes-back

## Introdução
Este projeto é o backend REST API do sistema de Clientes interno da LogPro.

## Tecnologias Utilizadas

* [Deno](https://deno.land): Runtime para JavaScript, TypeScript e WebAssembly que utiliza V8 e é construído em Rust.
* [TypeScript](https://www.typescriptlang.org): Linguagem fortemente tipada baseada no JavaScript.
* [PostgreSQL](https://www.postgresql.org): Banco de dados relacional open source.
* [Docker](https://www.docker.com): Um conjunto de produtos de plataforma como serviço que usam virtualização de nível de sistema operacional para entregar software em pacotes chamados contêineres.

## Configurando o Ambiente de Desenvolvimento

### Configurando o Docker

Primeiramente é necessário instalar o Docker Desktop (Windows) para criar o banco de dados.  
1. Faça o download e instale o [Docker Desktop](https://docs.docker.com/desktop/windows/install/);
2. Após a instalação, execute o seguinte comando em um terminal para criar o container do banco de dados PostgreSQL:  
```
docker run --name db-clientes-logpro -e POSTGRES_USER=logpro -e POSTGRES_PASSWORD=logpro -e POSTGRES_DB=logpro -p 5432:5432 --restart=always -d postgres
```
3. Acesse o banco de dados com o seu Client SQL preferido (DBeaver, pgAdmin, etc.), copie os SQLs presentes no arquivo `Cria Tabelas Clientes Logpro.sql` deste repositório e execute no banco de dados para criar toda a estrutura do banco de dados do projeto;

### Configurando o Deno

Para instalar o Deno na sua máquina (Windows), basta executar o seguinte comando no Powershell:
```
iwr https://deno.land/install.ps1 -useb | iex
```

Após a instalação, execute o comando `deno --version` para verificar se foi instalado corretamente; deve aparecer a versão atual do Deno, da V8 e do TypeScript; Ex:
```
deno 1.22.0 (release, x86_64-pc-windows-msvc)
v8 10.0.139.17
typescript 4.6.2
```

Agora você pode clonar este repositório na sua máquina e abrir com o seu editor de código preferido. Recomento fortemente utilizar o Visual Studio Code, que possui uma extensão oficial do Deno para dar suporte aos recursos e auto completion;

#### Configurando o Visual Studio Code

1. Instale a extensão `Deno` da denoland no Visual Studio Code: https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno
2. Crie uma pasta chamada `.vscode` na raiz do projeto, crie um arquivo chamado `settings.json` dentro dessa pasta e cole o seguinte conteúdo:
```json
{
    "deno.enable": true,
    "deno.lint": false,
}
```

Para conseguir subir o sistema, é necessário configurar as variáveis de ambiente utilizadas pelo sistema para conectar com o banco de dados, com a conta da S3 (utilizada para gerar os relatórios de backup) e com o SMTP para enviar e-mails.  
Crie um arquivo chamado `.env` na raiz do projeto com o seguinte conteúdo:
```
DB_DATABASE=logpro
DB_HOSTNAME=localhost
DB_USERNAME=logpro
DB_PASSWORD=logpro
DB_PORT=5432

S3_ACCESS_KEY=<access_key>
S3_SECRET_KEY=<secret_key>
S3_REGION=us-east-1
S3_ENDPOINT_URL=https://objects-us-east-1.dream.io

SMTP_HOSTNAME=smtp.gmail.com
SMTP_PORT=465
SMTP_USERNAME=san4hml@gmail.com
SMTP_PASSWORD=<password>
```
Obs: Alguns dados sensíveis foram omitidos por segurança. Solicite os dados do S3 (Dreamhost) e do e-mail aos responsáveis por eles.

Banco de dados:
* **DB_DATABASE** - Nome do banco de dados
* **DB_HOSTNAME** - IP da máquina do banco de dados
* **DB_USERNAME** - Usuário do banco de dados
* **DB_PASSWORD** - Senha do usuário do banco de dados
* **DB_PORT** - Porta do banco de dados

S3 Dreamhost:
* **S3_ACCESS_KEY** - Chave de acesso do servidor de backups
* **S3_SECRET_KEY** - Chave secreta do servidor de backups
* **S3_REGION** - Região do servidor
* **S3_ENDPOINT_URL** - URL para acessar o endpoint do servidor

SMTP Gmail:
* **SMTP_HOSTNAME** - Nome do host do servidor SMTP
* **SMTP_PORT** - Porta do servidor SMTP
* **SMTP_USERNAME** - E-mail utilizado para enviar os e-mails
* **SMTP_PASSWORD** - Senha gerada para utilizar o e-mail

Para iniciar o clientes-back, execute o seguinte comando na pasta raíz do projeto:
```
deno run --allow-read --allow-net --allow-write --allow-env mod.ts
```
E pronto! O servidor deve iniciar com sucesso na porta 9000.

## Configurando o servidor de produção pela primeira vez

Esta etapa abordará a configuração de um servidor **Linux** para deploy do sistema.

### Configure o banco de dados com Docker

[Instale o Docker](https://docs.docker.com/engine/install/ubuntu/) caso ele já não esteja instalado.

Crie o container do banco de dados:
```
docker run --name db-clientes-logpro -e POSTGRES_USER=logpro -e POSTGRES_PASSWORD=logpro -e POSTGRES_DB=logpro -p 5432:5432 --restart=always -d postgres
```

### Instale o Deno no servidor

Execute o comando:
```
curl -fsSL https://deno.land/install.sh | sh
```

### Configure as pastas

Crie a pasta base onde ficarão os arquivos do sistema na pasta *home* do usuário (ex usuário: logpro):  

Acesse a pasta home do usuário:
```
cd /home/logpro
```

Crie a pasta *clientes* e entre nela: 
```
mkdir clientes && cd clientes
```

Crie a pasta *clientes-back* e entre nela:
```
mkdir clientes-back && cd clientes-back
```

### Configure o arquivo *.env*

Dentro da pasta `/home/logpro/clientes/clientes-back`, crie o arquivo `.env`, que como explicado anteriormente, é onde ficam variáveis necessárias para o funcionamento do sistema (veja no item *Configurando o Deno*):
```
sudo vim .env
```

Pressione a tecla `I` para poder inserir texto no arquivo, então copie e cole o seguinte conteúdo, substituindo o que for necessário:
```
DB_DATABASE=logpro
DB_HOSTNAME=localhost
DB_USERNAME=logpro
DB_PASSWORD=logpro
DB_PORT=5432

S3_ACCESS_KEY=<access_key>
S3_SECRET_KEY=<secret_key>
S3_REGION=us-east-1
S3_ENDPOINT_URL=https://objects-us-east-1.dream.io

SMTP_HOSTNAME=smtp.gmail.com
SMTP_PORT=465
SMTP_USERNAME=san4hml@gmail.com
SMTP_PASSWORD=<password>
```

Pressione a tecla `Esc` para parar de editar, então digite: `:wq` e dê `Enter` para salvar.

### Compile o projeto

Vá na pasta raiz do projeto `clientes-back`, e execute o seguinte comando para compilar o projeto para um arquivo binário executável para Linux:
```
deno compile --allow-net --allow-read --allow-write --allow-env --target x86_64-unknown-linux-gnu --output clientes-back-bin mod.ts
```

Este comando irá gerar um arquivo chamado `clientes-back-bin`. Copie este arquivo para a pasta `/home/logpro/clientes/clientes-back` do servidor.

### Criar service para executar a aplicação no servidor

Crie um arquivo chamado `clientes-back.service` na pasta `/etc/systemd/system` com o seguinte conteúdo (substituindo o que for diferente no seu caso):
```
[Unit]
Description=Clientes_Back
After=network.target

[Service]
User=root
WorkingDirectory=/home/logpro/clientes/clientes-back
ExecStart=/home/logpro/clientes/clientes-back/clientes-back-bin
ExecReload=/bin/kill -HUP $MAINPID
Restart=always

[Install]
WantedBy=multi-user.target
```

Excute o seguinte comando para habilitar o arquivo como serviço no Linux:
```
sudo systemctl enable clientes-back.service
```

Para iniciar o serviço, basta executar o comando:
```
sudo systemctl start clientes-back
```

Após isso, a API já deve estar em execução. Para verificar o status do serviço, execute:
```
sudo systemctl status clientes-back
```

## Deploy de atualizações no servidor

Foram criados jobs no Jenkins da empresa para automatizar o processo de deploy dos projetos, eles podem ser encontrados no Jenkins na pasta `clientes-logpro`.
Caso seja necessário realizar o deploy manualmente, segue as instruções:

* Compile o projeto como já instruído acima;
* Renomeie o arquivo gerado para `clientes-back-bin` se necessário;
* Copie o arquivo para a pasta `/home/logpro/clientes/clientes-back` do servidor;
* Reinicie o serviço utilizando o comando: `sudo systemctl restart clientes-back`;

## Alterando o banco de dados

* Acesse a pasta `/home/logpro/clientes/clientes-back` do servidor;
* Edite o arquivo `.env` e altere os valores referentes ao banco de dados: `DB_DATABASE`, `DB_HOSTNAME`, `DB_USERNAME`, `DB_PASSWORD` e `DB_PORT`;
* Reinicie o serviço utilizando o comando: `sudo systemctl restart clientes-back`;
