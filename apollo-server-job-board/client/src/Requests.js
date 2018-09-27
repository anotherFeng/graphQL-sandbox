const endpointURL = 'http://localhost:9000/graphql';

async function graphqlRequest(query, variables){
  const response = await fetch(endpointURL,{
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({
      query: query,
      variables: variables
    })
  });
  const responseBody = await response.json();
  if(responseBody.errors){
    const message = responseBody.errors.map(error => error.message).join('\n');
    throw new Error(message)
  }
  return responseBody.data;
}

export async function loadCompany(id){
  const query = `query CompanyQuery($id: ID!){
    company(id: $id){
      name
      description
      jobs {
        id
        title
      }
    }
  }`;
  const data = await graphqlRequest(query, {id});
  return data.company;
}

export async function createJob(input){
  const mutation = `mutation CreateJob($input: CreateJobInput){
    job: createJob(input: $input){
      id
      title
      company{
        id
        name
      }
    }
  }`
  const {job} = await graphqlRequest(mutation, {input});
  return job;
}

export async function loadJob(id){
  const query = `query JobQuery($id: ID!){
    job(id: $id){
      id
      title
      company {
        id
        name
      }
      description
    }
  }`;
  const data = await graphqlRequest(query, {id})
  return data.job;
}

export async function loadJobs(){
  const query = `{
    jobs {
      id
      title
      company{
        id
        name
      }
    }
  }`;
  const data = await graphqlRequest(query);
  return data.jobs;
}
