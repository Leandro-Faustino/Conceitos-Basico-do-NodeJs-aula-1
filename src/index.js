const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json()); //avisar que  minha rota vai ter json()

const projects = []; //onde vai armazenar todos meus projetos
 
function logRequests( request, response, next ) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`; 

  console.time(logLabel);

   next(); //proximo middleware

   console.timeEnd(logLabel);
}

function validateProjectId( request, response, next ) {
    const { id } = request.params;
  
    if (!isUuid(id)) {
        return response.status(400).json({ error: 'Invalid project ID' })
    }
  
    return next(); //proximo middleware
  }


app.use(logRequests);

//listar informação
app.get('/projects', (request,response) => {
  const { title } = request.query;
 
  //vou percorrer array projects e  filtrar os project que contem o title igaul ao passado pro paramentro
  const results = title 
   ? projects.filter(project => project.title.includes(title)) //include(retorna true ou false verifica se o title esta contido dentro do title do array)
   : projects;
   //se true retorna somente o que foi filtrado, senao retorna array normal
    return response.json( results); 
     
}),

//criar informações -sempre que criar um projeto novo colocar um id()
//eu crio um projeto novo,adiciono na estrutura e mostro projeto novo criado
app.post('/projects', (request,response) => {
  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner };

  projects.push(project);

  return response.json( project );
     
}),

//editar e atualizar uma ☝ informações( estou querendo atualizar projeto com id ...1.2...) http://localhost:3333/projects/1
app.put('/projects/:id', validateProjectId,(request,response) => {
    const { id } = request.params;
    const { title, owner } = request.body

//vou percorrer meu array de projetos e procurar a posição[indice] do projeto com id igual ao que foi passado pro paramentro na rota
    const projectIndex = projects.findIndex( project => project.id === id );
   
    //validar se existe id,se existir vai ter uma posição acima de 0 senao erro 
    if (projectIndex < 0 ) {
        return response.status(400).json({ error: 'project not found.'})
    }

    // vou criar projeto atualisado que vai substituir que achei no indice
    const project = {
       id,
       title,
       owner
    }

    //vou no array de projetos vou procurar o indiceproject que achei  e substituir pelo projeto criado atual
    projects[projectIndex] = project;

    return response.json( project );
       
}),

//deletar informações( estou querendo deletar projeto com id ...1.2...) http://localhost:3333/projects/1
app.delete('/projects/:id', validateProjectId,(request,response) => {
const { id } = request.params;

//vou percorrer meu array de projetos e procurar a posição[indice] do projeto com id igual ao que foi passado pro paramentro na rota
const projectIndex = projects.findIndex( project => project.id === id );
   
//validar se existe id,se existir vai ter uma posição acima de 0 senao erro 
if (projectIndex < 0 ) {
    return response.status(400).json({ error: 'project not found.'})
}

//tirar uma informaçaõ de dentro do meu array splice(indice quero remover, quantas posções a partir deste indice)
projects.splice(projectIndex, 1);

    return response.status(204).send();
}),

app.listen(3333,() => {
    console.log('✌ servidor rodando com sucesso!')
});