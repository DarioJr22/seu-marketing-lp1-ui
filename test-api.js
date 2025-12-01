// Script de teste da API
// Cole este código no console do navegador para testar

const API_URL = 'https://seumarketing-api-production.up.railway.app/api';

// Teste 1: Verificar se a API está online
async function testAPI() {
  console.log('🧪 Testando API...');
  
  // Teste GET Portfolio
  try {
    console.log('\n📋 Teste 1: GET /portfolio');
    const portfolioResponse = await fetch(`${API_URL}/portfolio`);
    console.log('Status:', portfolioResponse.status);
    const portfolioData = await portfolioResponse.json();
    console.log('✅ Portfolio:', portfolioData);
  } catch (error) {
    console.error('❌ Erro no portfolio:', error);
  }

  // Teste POST Lead
  try {
    console.log('\n📋 Teste 2: POST /leads');
    const leadPayload = {
      nome: 'Teste Frontend',
      email: 'teste@frontend.com',
      telefone: '81999999999',
      empresa: 'Teste Inc',
      mensagem: 'Teste de integração',
      servicos: ['Gestão de Redes Sociais', 'Tráfego Pago'],
      orcamentoMin: 5000,
      orcamentoMax: 10000,
      origem: 'teste'
    };
    console.log('Payload:', leadPayload);
    
    const leadResponse = await fetch(`${API_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(leadPayload)
    });
    
    console.log('Status:', leadResponse.status);
    
    if (leadResponse.ok) {
      const leadData = await leadResponse.json();
      console.log('✅ Lead criado:', leadData);
    } else {
      const error = await leadResponse.text();
      console.error('❌ Erro ao criar lead:', error);
    }
  } catch (error) {
    console.error('❌ Erro no lead:', error);
  }

  // Teste POST Agendamento
  try {
    console.log('\n📋 Teste 3: POST /agendamentos/agendar');
    const agendamentoPayload = {
      nome: 'Teste Frontend',
      email: 'teste@frontend.com',
      telefone: '81999999999',
      empresa: 'Teste Empresa',
      mensagem: 'Teste de agendamento',
      servicos: ['Gestão de Redes Sociais', 'Tráfego Pago'],
      orcamentoMin: 1000,
      orcamentoMax: 5000,
      dataAgendamento: '2025-12-15',
      horario: '10:00',
      preferencia: 'whatsapp'
    };
    console.log('Payload:', agendamentoPayload);
    
    const agendamentoResponse = await fetch(`${API_URL}/agendamentos/agendar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(agendamentoPayload)
    });
    
    console.log('Status:', agendamentoResponse.status);
    
    if (agendamentoResponse.ok) {
      const agendamentoData = await agendamentoResponse.json();
      console.log('✅ Agendamento criado:', agendamentoData);
    } else {
      const error = await agendamentoResponse.text();
      console.error('❌ Erro ao criar agendamento:', error);
    }
  } catch (error) {
    console.error('❌ Erro no agendamento:', error);
  }
}

// Execute o teste
testAPI();
