# Smart-table-api

## Table of contents

- [Overview](#overview)
  - [The objectives](#the-objectives)
  - [How to run the project](#How-to-run-the-project)
  - [Solution link](#Solution-link)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
- [Author](#author)

## Overview

### The objectives

- API responsável pelo processo de processamento da [smart-table](https://github.com/Christian-M-Silva/smart-table-front)

### How to run the project
  1. Após o download do codigo na sua maquina, rode no terminal do projeto:
  ```bash
    npm i 
    # or:
    yarn
  ```

  2. Altere o ```.env.example``` para ```.env```

  3. Será necessário no ```.env``` incluir algumas chaves secretas elas tem que ser a mesma usada no smart-table-api:
  ```
    CLIENT_ID= Chave obtida no google console, terá que criar um projeto para isso
    CLIENT_SECRET= Chave obtida no google console, terá que criar um projeto para isso
    SECRET_KEY= Chave aleatorio escolhida pelo user
  ```
   **Para gerar as chaves é só seguir as instruções do google nesse [link](https://developers.google.com/calendar/api/quickstart/nodejs?hl=pt-brink)**

  4. Após o sucesso do download dos pacotes, rode no terminal do projeto:
  ```bash
    npm run dev 
    # or:
    yarn dev
  ```

### Solution link

[Clique aqui para ir até o projeto](https://github.com/Christian-M-Silva/smart-table-api)

## My process

### What I learned

Aprendi a usar a integração com a API de calendario da google.

## Author

- Name - Christian
- Linkedin - [@Christian Silva]( https://www.linkedin.com/in/christian-silva-83172621a)
- GitHub - [@Christian Silva](https://github.com/Christian-M-Silva)