# EOS Teste - Backend

Backend do Teste da EOS

## Instruções

Você pode utilizar a url enviada via email para testar o projeto publicado. E para rodar em localhost, siga as instruções abaixo

- Clone o reporitório
- No terminal, rode ``npm install`` e depois ``npm run dev``
- Happy coding!

## Descrição das Libs/Framework
- Node.js versão 18.18 com TypeScript versão 5
- ESLint com Prettier
- [tsup](https://github.com/egoist/tsup)
- [tsx](https://github.com/esbuild-kit/tsx)
- express - para lidar com as rotas
- bcrypt - para criptografar a senha
- dayjs - para lidar com formatação de datas
- jsonwebtoken - para lidar com tokens jwt
- multer e mime-types - para lidar com arquivos como a thumbnail/imagem do post
- Nodemailer - para lidar com envios de email, e para isso foi usado o Mailtrap
- Banco de dados: SQLite com o Prisma como ORM

Para entrar no Mailtrap e ver o envio de emails funcionando, acesse o Mailtrap com essas credenciais:

- Email: ivanbjunior.93+eos@gmail.com
- Senha: EOS@6QvMfyNvy2
- Link de acesso: [https://mailtrap.io/signin](https://mailtrap.io/signin)

### Requisitos Funcionais
- O usuário deve poder fazer o login
- O usuário deve poder ver/criar/alterar o seu perfil
- O usuário deve poder ver/criar/alterar/excluir um post
- O usuário deve poder ver/criar/alterar/excluir um comentário em um post
- O usuário deve poder dar like ou dislike nos posts

### Regras
- Somente o usuário admin pode ver ou excluir os outros perfis que não seja o dele mesmo (regra criada somente demonstração de verificação de permissões)
- Apenas o proprietário do post pode editar ou excluir o post
- Apenas o proprietário do comentário pode editar um comentário
- Apenas o proprietário do post e o dono do comentário podem excluir um comentário
- Apenas o proprietário do comentário pode editar o comentário