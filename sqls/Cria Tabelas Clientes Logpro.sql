CREATE TABLE IF NOT EXISTS usuario (
  id SERIAL PRIMARY KEY NOT NULL,
  codigo varchar(100) NOT NULL,
  email varchar(255) NOT NULL,
  nome varchar(255) NOT NULL,
  senha varchar(255) NOT NULL,
  ativo boolean NOT NULL DEFAULT true,
  tipo varchar(5) NOT NULL DEFAULT 'user',
  ip_maquina varchar(100),
  CONSTRAINT usuario_codigo_uk UNIQUE (codigo),
  CONSTRAINT usuario_email_uk UNIQUE (email),
  CONSTRAINT usuario_tipo_ck CHECK (tipo IN (
    'admin',
    'user'
  ))
);

CREATE TABLE IF NOT EXISTS sql (
  id SERIAL PRIMARY KEY NOT NULL,
  codigo varchar(100) NOT NULL,
  descricao varchar(255) NOT NULL,
  sql text NOT NULL,
  CONSTRAINT sql_codigo_uk UNIQUE (codigo)
);

CREATE TABLE IF NOT EXISTS cliente (
  id SERIAL PRIMARY KEY NOT NULL,
  codigo varchar(100) NOT NULL,
  nome varchar(255) NOT NULL,
  febraban varchar(255),
  email varchar(255),
  telefone varchar(255),
  tecnicoresponsavel varchar(255),
  CONSTRAINT cliente_codigo_uk UNIQUE (codigo)
);

CREATE TABLE IF NOT EXISTS backupconfig (
  id SERIAL PRIMARY KEY NOT NULL,
  descricao varchar(255),
  cliente_id int NOT NULL,
  usuariodb varchar(100) NOT NULL,
  senhadb varchar(255) NOT NULL,
  nomedb varchar(255) NOT NULL,
  host varchar(255) NOT NULL,
  port int NOT NULL,
  caminhobackup varchar(255),
  caminhojava varchar(255),
  caminhopgdump varchar(255),
  caminhosendhostjar varchar(255),
  horaexecucaobackup time,
  tiposervidor_id int NOT NULL,
  hostnamenuvem varchar(255),
  nomediretorionuvem varchar(255),
  qtdiasbackupnuvem int
);

CREATE TABLE IF NOT EXISTS contato (
  id SERIAL PRIMARY KEY NOT NULL,
  nome varchar(255) NOT NULL,
  email varchar(255),
  telefone varchar(255),
  cliente_id int NOT NULL
);

CREATE TABLE IF NOT EXISTS sistema (
  id SERIAL PRIMARY KEY,
  nome varchar(255) NOT NULL,
  url varchar(255),
  tipo varchar(100) NOT NULL DEFAULT 'outro',
  cliente_id int NOT NULL,
  ordem int,
  CONSTRAINT sistema_tipo_ck CHECK (tipo IN (
    'gsaninterno',
    'gsanexterno',
    'gestorinterno',
    'gestorexterno',
    'outro'
  ))
);

CREATE TABLE IF NOT EXISTS conexao (
  id SERIAL PRIMARY KEY NOT NULL,
  tipoconexao_id int NOT NULL,
  ip varchar(20),
  usuario varchar(255),
  senha varchar(255),
  cliente_id int NOT NULL
);

CREATE TABLE IF NOT EXISTS tipoconexao (
  id SERIAL PRIMARY KEY NOT NULL,
  codigo varchar(100) NOT NULL,
  nome varchar(255) NOT NULL,
  CONSTRAINT tipoconexao_codigo_uk UNIQUE (codigo)
);

CREATE TABLE IF NOT EXISTS tiposervidor (
  id SERIAL PRIMARY KEY NOT NULL,
  codigo varchar(100) NOT NULL,
  nome varchar(255) NOT NULL,
  CONSTRAINT tiposervidor_codigo_uk UNIQUE (codigo)
);

ALTER TABLE contato ADD FOREIGN KEY (cliente_id) REFERENCES cliente(id);

ALTER TABLE conexao ADD FOREIGN KEY (cliente_id) REFERENCES cliente(id);

ALTER TABLE backupconfig ADD FOREIGN KEY (cliente_id) REFERENCES cliente(id);

ALTER TABLE backupconfig ADD FOREIGN KEY (tiposervidor_id) REFERENCES tiposervidor(id);

ALTER TABLE sistema ADD FOREIGN KEY (cliente_id) REFERENCES cliente(id);

ALTER TABLE conexao ADD FOREIGN KEY (tipoconexao_id) REFERENCES tipoconexao(id);

CREATE SCHEMA IF NOT EXISTS audit;

CREATE TABLE IF NOT EXISTS audit.revinfo (
  id SERIAL PRIMARY KEY NOT NULL,
  recurso varchar(100) NOT NULL,
  registro_id int,
  datahora timestamp NOT NULL,
  usuario varchar(100) NOT NULL,
  tipo varchar(10) NOT NULL,
  ip varchar(100) NOT NULL,
  CONSTRAINT revinfo_tipo_ck CHECK (tipo IN (
    'create',
    'update',
    'delete'
  ))
);

CREATE TABLE IF NOT EXISTS tokenusuario (
  token varchar(255) NOT NULL,
  usuario_id int NOT NULL,
  CONSTRAINT tokenusuario_usuario_id_fk FOREIGN KEY (usuario_id) REFERENCES usuario(id),
  CONSTRAINT tokenusuario_usuario_id_uk UNIQUE (usuario_id)
);

-- Inserir dados pré configurados

INSERT INTO tiposervidor (codigo, nome)
VALUES ('dreamhost', 'DreamHost'),
('ftp', 'FTP');

INSERT INTO tipoconexao (codigo, nome)
VALUES ('windows', 'Windows'),
('teamviewer', 'TeamViewer'),
('anydesk', 'AnyDesk');