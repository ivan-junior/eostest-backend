# EOS Teste - Backend

Backend do Teste da EOS

## Instruções

Você pode utilizar a url enviada via email para testar o projeto publicado. E para rodar em localhost, siga as instruções abaixo

- Clone o reporitório
- No terminal, rode ``npm install`` e depois ``npm run dev``
- Happy coding!

## Descrição das Libs/Framework
- Node.js com TypeScript
- ESLint com Prettier
- [tsup](https://github.com/egoist/tsup)
- [tsx](https://github.com/esbuild-kit/tsx)
- express - para lidar com as rotas
- bcrypt - para criptografar a senha
- dayjs - para lidar com formatação de datas
- jsonwebtoken - para lidar com tokens jwt
- multer e mime-types - para lidar com arquivos como a thumbnail do post
- Banco de dados: SQLite com o Prisma de ORM

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