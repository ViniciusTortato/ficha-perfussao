import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  Heart, 
  Users, 
  Activity, 
  Package, 
  Calculator, 
  Clock, 
  TestTube, 
  Pill,
  TrendingUp,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface ApiData {
  hospitais: any[];
  cirurgioes: any[];
  anestesistas: any[];
  perfusionistas: any[];
  comorbidades: any[];
  diagnosticos: any[];
  medicamentos: any[];
  procedimentos: any[];
  convenios: any[];
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('paciente');
  const [apiData, setApiData] = useState<ApiData>({
    hospitais: [],
    cirurgioes: [],
    anestesistas: [],
    perfusionistas: [],
    comorbidades: [],
    diagnosticos: [],
    medicamentos: [],
    procedimentos: [],
    convenios: []
  });

  const [formData, setFormData] = useState({
    // Dados do Paciente
    nome: '',
    iniciais: '',
    peso: '',
    sexo: '',
    altura: '',
    dataNascimento: '',
    idade: '',
    
    // Informações Gerais
    dataCirurgia: '',
    medicacoes: [] as string[],
    registroHospitalar: '',
    hospital: '',
    convenio: '',
    observacoes: '',
    
    // Diagnóstico, Comorbidades, Procedimento
    diagnosticoCirurgico: '',
    comorbidades: '',
    procedimento: '',
    
    // Equipe Cirúrgica
    cirurgiaoP: '',
    cirurgiao1: '',
    cirurgiao2: '',
    anestesista: '',
    residenteAnestesia: '',
    perfusionista: '',
    instrumentador: '',
    circulante: '',
    
    // Dados Pré Operatórios
    pamInicial: '',
    pamPosAnestesia: '',
    fcInicial: '',
    fcPosAnestesia: '',
    
    // ECO e Exames
    ecocardiograma: '',
    exameslaboratoriais: ''
  });

  const tabs = [
    { id: 'paciente', label: 'Dados do Paciente', icon: User },
    { id: 'geral', label: 'Informações Gerais', icon: Calendar },
    { id: 'clinico', label: 'Dados Clínicos', icon: Heart },
    { id: 'equipe', label: 'Equipe Cirúrgica', icon: Users },
    { id: 'preop', label: 'Pré-Operatório', icon: Activity },
    { id: 'materiais', label: 'Materiais', icon: Package },
    { id: 'calculos', label: 'Cálculos', icon: Calculator },
    { id: 'perfusao', label: 'Perfusão', icon: Clock },
    { id: 'exames', label: 'Exames Lab.', icon: TestTube },
    { id: 'farmacos', label: 'Fármacos', icon: Pill },
    { id: 'metabolismo', label: 'Metabolismo', icon: TrendingUp },
    { id: 'saida', label: 'Saída CEC', icon: LogOut }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          { key: 'hospitais', url: 'https://n8n-hook.digitalmvp.com.br/webhook/d717c4d9-0c62-439f-8828-79c7f0cf67ff' },
          { key: 'cirurgioes', url: 'https://n8n-hook.digitalmvp.com.br/webhook/2cd8c83d-d7eb-448d-855a-2a8d4405390d' },
          { key: 'anestesistas', url: 'https://n8n-hook.digitalmvp.com.br/webhook/e1062e37-a396-4b36-9b45-e1c119e59ed7' },
          { key: 'perfusionistas', url: 'https://n8n-main.digitalmvp.com.br/webhook/f6168e40-64f7-4410-9307-8ef3728ae9c2' },
          { key: 'comorbidades', url: 'https://n8n-hook.digitalmvp.com.br/webhook/20b2e609-ce74-4bc7-a24d-8f03ec363b5c' },
          { key: 'diagnosticos', url: 'https://n8n-hook.digitalmvp.com.br/webhook/e2bb8c7f-7de3-4141-953d-5fbcec9ea64a' },
          { key: 'medicamentos', url: 'https://n8n-hook.digitalmvp.com.br/webhook/36962eab-1eff-484a-8466-08b4d3558461' },
          { key: 'procedimentos', url: 'https://n8n-hook.digitalmvp.com.br/webhook/fe50ea6a-ba5b-43a8-b3a9-41f58e2a2fe8' },
          { key: 'convenios', url: 'https://n8n-hook.digitalmvp.com.br/webhook/0a1d9e73-cc76-4207-b99c-e6811b489201' }
        ];

        const results = await Promise.allSettled(
          endpoints.map(async ({ key, url }) => {
            const response = await fetch(url);
            const data = await response.json();
            return { key, data: Array.isArray(data) ? data : [] };
          })
        );

        const newApiData = { ...apiData };
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            const { key, data } = result.value;
            newApiData[key as keyof ApiData] = data;
          }
        });

        setApiData(newApiData);
      } catch (error) {
        console.error('Erro ao carregar dados das APIs:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'paciente':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Dados do Paciente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nome completo do paciente"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Iniciais</label>
                  <input
                    type="text"
                    value={formData.iniciais}
                    onChange={(e) => handleInputChange('iniciais', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: J.S."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peso (Kg)</label>
                  <input
                    type="number"
                    value={formData.peso}
                    onChange={(e) => handleInputChange('peso', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                  <select
                    value={formData.sexo}
                    onChange={(e) => handleInputChange('sexo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Altura (Cm)</label>
                  <input
                    type="number"
                    value={formData.altura}
                    onChange={(e) => handleInputChange('altura', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="170"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                  <input
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Idade (Anos)</label>
                  <input
                    type="number"
                    value={formData.idade}
                    onChange={(e) => handleInputChange('idade', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    placeholder="Calculado automaticamente"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'geral':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Informações Gerais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data da Cirurgia</label>
                  <input
                    type="date"
                    value={formData.dataCirurgia}
                    onChange={(e) => handleInputChange('dataCirurgia', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registro Hospitalar</label>
                  <input
                    type="text"
                    value={formData.registroHospitalar}
                    onChange={(e) => handleInputChange('registroHospitalar', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Número do registro"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hospital</label>
                  <select
                    value={formData.hospital}
                    onChange={(e) => handleInputChange('hospital', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione o hospital</option>
                    {apiData.hospitais.map((hospital, index) => (
                      <option key={index} value={hospital.nome || hospital}>
                        {hospital.nome || hospital}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Convênio</label>
                  <select
                    value={formData.convenio}
                    onChange={(e) => handleInputChange('convenio', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione o convênio</option>
                    {apiData.convenios.map((convenio, index) => (
                      <option key={index} value={convenio.nome || convenio}>
                        {convenio.nome || convenio}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medicações em Uso</label>
                  <select
                    multiple
                    value={formData.medicacoes}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      handleInputChange('medicacoes', values);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                  >
                    {apiData.medicamentos.map((medicamento, index) => (
                      <option key={index} value={medicamento.nome || medicamento}>
                        {medicamento.nome || medicamento}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Segure Ctrl/Cmd para selecionar múltiplos medicamentos</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                  <textarea
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Observações gerais sobre o paciente ou procedimento"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'clinico':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-blue-600" />
                Dados Clínicos
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico Cirúrgico</label>
                  <select
                    value={formData.diagnosticoCirurgico}
                    onChange={(e) => handleInputChange('diagnosticoCirurgico', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione o diagnóstico</option>
                    {apiData.diagnosticos.map((diagnostico, index) => (
                      <option key={index} value={diagnostico.nome || diagnostico}>
                        {diagnostico.nome || diagnostico}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comorbidades</label>
                  <select
                    value={formData.comorbidades}
                    onChange={(e) => handleInputChange('comorbidades', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione as comorbidades</option>
                    {apiData.comorbidades.map((comorbidade, index) => (
                      <option key={index} value={comorbidade.nome || comorbidade}>
                        {comorbidade.nome || comorbidade}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Procedimento</label>
                  <select
                    value={formData.procedimento}
                    onChange={(e) => handleInputChange('procedimento', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione o procedimento</option>
                    {apiData.procedimentos.map((procedimento, index) => (
                      <option key={index} value={procedimento.nome || procedimento}>
                        {procedimento.nome || procedimento}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'equipe':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Equipe Cirúrgica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cirurgião Principal</label>
                  <select
                    value={formData.cirurgiaoP}
                    onChange={(e) => handleInputChange('cirurgiaoP', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione o cirurgião</option>
                    {apiData.cirurgioes.map((cirurgiao, index) => (
                      <option key={index} value={cirurgiao.nome || cirurgiao}>
                        {cirurgiao.nome || cirurgiao}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">1º Cirurgião</label>
                  <select
                    value={formData.cirurgiao1}
                    onChange={(e) => handleInputChange('cirurgiao1', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione o cirurgião</option>
                    {apiData.cirurgioes.map((cirurgiao, index) => (
                      <option key={index} value={cirurgiao.nome || cirurgiao}>
                        {cirurgiao.nome || cirurgiao}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">2º Cirurgião</label>
                  <select
                    value={formData.cirurgiao2}
                    onChange={(e) => handleInputChange('cirurgiao2', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione o cirurgião</option>
                    {apiData.cirurgioes.map((cirurgiao, index) => (
                      <option key={index} value={cirurgiao.nome || cirurgiao}>
                        {cirurgiao.nome || cirurgiao}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Anestesista</label>
                  <select
                    value={formData.anestesista}
                    onChange={(e) => handleInputChange('anestesista', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione o anestesista</option>
                    {apiData.anestesistas.map((anestesista, index) => (
                      <option key={index} value={anestesista.nome || anestesista}>
                        {anestesista.nome || anestesista}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Residente Anestesia</label>
                  <input
                    type="text"
                    value={formData.residenteAnestesia}
                    onChange={(e) => handleInputChange('residenteAnestesia', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nome do residente"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Perfusionista</label>
                  <select
                    value={formData.perfusionista}
                    onChange={(e) => handleInputChange('perfusionista', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione o perfusionista</option>
                    {apiData.perfusionistas.map((perfusionista, index) => (
                      <option key={index} value={perfusionista.nome || perfusionista}>
                        {perfusionista.nome || perfusionista}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instrumentador</label>
                  <input
                    type="text"
                    value={formData.instrumentador}
                    onChange={(e) => handleInputChange('instrumentador', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nome do instrumentador"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Circulante</label>
                  <input
                    type="text"
                    value={formData.circulante}
                    onChange={(e) => handleInputChange('circulante', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nome do circulante"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'preop':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                Dados Pré-Operatórios
              </h3>
              
              {/* Sinais Vitais */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-800 mb-3">Sinais Vitais</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Parâmetro</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Inicial</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Pós Anestesia</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-2 border-b border-gray-300 text-sm font-medium">P.A.M. (mmHg)</td>
                        <td className="px-4 py-2 border-b border-gray-300">
                          <input
                            type="number"
                            value={formData.pamInicial}
                            onChange={(e) => handleInputChange('pamInicial', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="80"
                          />
                        </td>
                        <td className="px-4 py-2 border-b border-gray-300">
                          <input
                            type="number"
                            value={formData.pamPosAnestesia}
                            onChange={(e) => handleInputChange('pamPosAnestesia', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="75"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-b border-gray-300 text-sm font-medium">F.C. (bpm)</td>
                        <td className="px-4 py-2 border-b border-gray-300">
                          <input
                            type="number"
                            value={formData.fcInicial}
                            onChange={(e) => handleInputChange('fcInicial', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="70"
                          />
                        </td>
                        <td className="px-4 py-2 border-b border-gray-300">
                          <input
                            type="number"
                            value={formData.fcPosAnestesia}
                            onChange={(e) => handleInputChange('fcPosAnestesia', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="65"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Índices Calculados */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-800 mb-3">Índices Calculados</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Superfície Corpórea (m²)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
                      placeholder="Calculado automaticamente"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">I.M.C. (kg/m²)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
                      placeholder="Calculado automaticamente"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Exames */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ECO Cardiograma</label>
                  <textarea
                    value={formData.ecocardiograma}
                    onChange={(e) => handleInputChange('ecocardiograma', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Resultados do ecocardiograma"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exames Laboratoriais</label>
                  <textarea
                    value={formData.exameslaboratoriais}
                    onChange={(e) => handleInputChange('exameslaboratoriais', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Resultados dos exames laboratoriais"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'materiais':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-blue-600" />
                Materiais Utilizados
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Material</th>
                      <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Marca</th>
                      <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Modelo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      'Oxigenador',
                      'Reservatório Venoso',
                      'Bomba Arterial',
                      'Filtro Arterial',
                      'Cânula Arterial',
                      'Cânula Venosa',
                      'Cardioplegia',
                      'Aspirador',
                      'Outros'
                    ].map((material, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border-b border-gray-300 text-sm font-medium">{material}</td>
                        <td className="px-4 py-2 border-b border-gray-300">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Marca"
                          />
                        </td>
                        <td className="px-4 py-2 border-b border-gray-300">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Modelo"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'calculos':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-blue-600" />
                Cálculos para Perfusão
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Coluna 1 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Índice Cardíaco (L/min/m²)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
                      placeholder="Calculado automaticamente"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fluxo Teórico (L/min)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
                      placeholder="Calculado automaticamente"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hemodiluição (%)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
                      placeholder="Calculado automaticamente"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Volume Perfusato (mL)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
                      placeholder="Calculado automaticamente"
                      readOnly
                    />
                  </div>
                </div>
                
                {/* Coluna 2 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Anticoagulação (UI/kg)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
                      placeholder="Calculado automaticamente"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Protamina (mg)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
                      placeholder="Calculado automaticamente"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bicarbonato (mEq)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
                      placeholder="Calculado automaticamente"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Manitol (mL)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
                      placeholder="Calculado automaticamente"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'perfusao':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Perfusão - Tempos e Monitorização
              </h3>
              
              {/* Tempos */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-800 mb-3">Tempos</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Evento</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Início</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Fim</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Duração (min)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        'C.E.C.',
                        'Pinçamento Aórtico',
                        'Parada Circulatória',
                        'Hipotermia',
                        'Reaquecimento'
                      ].map((evento, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 border-b border-gray-300 text-sm font-medium">{evento}</td>
                          <td className="px-4 py-2 border-b border-gray-300">
                            <input
                              type="time"
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-2 border-b border-gray-300">
                            <input
                              type="time"
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-2 border-b border-gray-300">
                            <input
                              type="text"
                              className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-50 focus:outline-none"
                              placeholder="Auto"
                              readOnly
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Proteção Miocárdica */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-800 mb-3">Proteção Miocárdica</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Cardioplegia</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Selecione</option>
                      <option value="cristaloide">Cristalóide</option>
                      <option value="sanguinea">Sanguínea</option>
                      <option value="mista">Mista</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Volume Total (mL)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1000"
                    />
                  </div>
                </div>
              </div>

              {/* Monitorização */}
              <div>
                <h4 className="text-md font-medium text-gray-800 mb-3">Monitorização</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    'Capnografia',
                    'Equilíbrio Ác-Base',
                    'Temperatura',
                    'Pressão Arterial',
                    'Fluxo',
                    'Saturação Venosa'
                  ].map((parametro, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{parametro}</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Valor"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'exames':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TestTube className="w-5 h-5 mr-2 text-blue-600" />
                Exames Laboratoriais durante C.E.C.
              </h3>
              
              {/* Parâmetros da C.E.C. */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-800 mb-3">Parâmetros da C.E.C. durante Coleta</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Parâmetro</th>
                        {[1, 2, 3, 4, 5, 6].map(col => (
                          <th key={col} className="px-4 py-2 border-b border-gray-300 text-center text-sm font-medium text-gray-700">
                            {col}ª Coleta
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        'Fluxo (L/min)',
                        'Temp. (°C)',
                        'P.A.M. (mmHg)',
                        'P.V.C. (mmHg)',
                        'Horário'
                      ].map((parametro, rowIndex) => (
                        <tr key={rowIndex}>
                          <td className="px-4 py-2 border-b border-gray-300 text-sm font-medium">{parametro}</td>
                          {[1, 2, 3, 4, 5, 6].map(col => (
                            <td key={col} className="px-4 py-2 border-b border-gray-300">
                              <input
                                type={parametro === 'Horário' ? 'time' : 'number'}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder={parametro === 'Horário' ? '' : '0'}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Exames Laboratoriais */}
              <div>
                <h4 className="text-md font-medium text-gray-800 mb-3">Resultados Laboratoriais</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Exame</th>
                        {[1, 2, 3, 4, 5].map(col => (
                          <React.Fragment key={col}>
                            <th className="px-4 py-2 border-b border-gray-300 text-center text-sm font-medium text-gray-700">
                              {col}ª A
                            </th>
                            <th className="px-4 py-2 border-b border-gray-300 text-center text-sm font-medium text-gray-700">
                              {col}ª V
                            </th>
                          </React.Fragment>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        'pH',
                        'pCO2 (mmHg)',
                        'pO2 (mmHg)',
                        'HCO3 (mEq/L)',
                        'BE (mEq/L)',
                        'Sat O2 (%)',
                        'Hb (g/dL)',
                        'Ht (%)',
                        'Na+ (mEq/L)',
                        'K+ (mEq/L)',
                        'Glicose (mg/dL)',
                        'Lactato (mg/dL)'
                      ].map((exame, rowIndex) => (
                        <tr key={rowIndex}>
                          <td className="px-4 py-2 border-b border-gray-300 text-sm font-medium">{exame}</td>
                          {[1, 2, 3, 4, 5].map(col => (
                            <React.Fragment key={col}>
                              <td className="px-4 py-2 border-b border-gray-300">
                                <input
                                  type="number"
                                  step="0.01"
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  placeholder="0"
                                />
                              </td>
                              <td className="px-4 py-2 border-b border-gray-300">
                                <input
                                  type="number"
                                  step="0.01"
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  placeholder="0"
                                />
                              </td>
                            </React.Fragment>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case 'farmacos':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Pill className="w-5 h-5 mr-2 text-blue-600" />
                Fármacos e Soluções Utilizadas
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Medicamento</th>
                      <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Dose</th>
                      <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Via</th>
                      <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Horário</th>
                      <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Observações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      'Heparina',
                      'Protamina',
                      'Bicarbonato de Sódio',
                      'Manitol',
                      'Furosemida',
                      'Dopamina',
                      'Dobutamina',
                      'Noradrenalina',
                      'Adrenalina',
                      'Milrinona',
                      'Nitroglicerina',
                      'Nitroprussiato',
                      'Outros'
                    ].map((medicamento, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border-b border-gray-300 text-sm font-medium">{medicamento}</td>
                        <td className="px-4 py-2 border-b border-gray-300">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Dose"
                          />
                        </td>
                        <td className="px-4 py-2 border-b border-gray-300">
                          <select className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                            <option value="">Via</option>
                            <option value="IV">IV</option>
                            <option value="VO">VO</option>
                            <option value="IM">IM</option>
                            <option value="SC">SC</option>
                            <option value="Perfusato">Perfusato</option>
                          </select>
                        </td>
                        <td className="px-4 py-2 border-b border-gray-300">
                          <input
                            type="time"
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-2 border-b border-gray-300">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Observações"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'metabolismo':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Parâmetros de Metabolismo
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Parâmetro</th>
                      {[1, 2, 3, 4, 5, 6].map(col => (
                        <th key={col} className="px-4 py-2 border-b border-gray-300 text-center text-sm font-medium text-gray-700">
                          {col}ª Coleta
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      'DO2 (mL/min/m²)',
                      'VO2 (mL/min/m²)',
                      'TEO2 (%)',
                      'Shunt (%)',
                      'Dif A-V O2 (mL/dL)',
                      'REO2',
                      'Dif A-V CO2 (mL/dL)',
                      'pH corrigido',
                      'pCO2 corrigido (mmHg)'
                    ].map((parametro, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="px-4 py-2 border-b border-gray-300 text-sm font-medium">{parametro}</td>
                        {[1, 2, 3, 4, 5, 6].map(col => (
                          <td key={col} className="px-4 py-2 border-b border-gray-300">
                            <input
                              type="text"
                              className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-50 focus:outline-none"
                              placeholder="Auto"
                              readOnly
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'saida':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <LogOut className="w-5 h-5 mr-2 text-blue-600" />
                Saída de Circulação Extracorpórea
              </h3>
              
              <div className="space-y-6">
                {/* Transfusão */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3">Transfusão</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      'Concentrado de Hemácias (mL)',
                      'Plasma Fresco (mL)',
                      'Plaquetas (mL)',
                      'Crioprecipitado (mL)'
                    ].map((item, index) => (
                      <div key={index}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{item}</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suporte Farmacológico */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3">Suporte Farmacológico</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      'Inotrópicos',
                      'Vasopressores',
                      'Vasodilatadores',
                      'Antiarrítmicos'
                    ].map((categoria, index) => (
                      <div key={index}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{categoria}</label>
                        <textarea
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Medicamentos da categoria ${categoria.toLowerCase()}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Parâmetros Finais */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3">Parâmetros na Saída</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      'P.A.M. Final (mmHg)',
                      'F.C. Final (bpm)',
                      'Temperatura Final (°C)',
                      'Diurese Total (mL)',
                      'Balanço Hídrico (mL)',
                      'Tempo Total C.E.C. (min)'
                    ].map((parametro, index) => (
                      <div key={index}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{parametro}</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Observações Finais */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3">Observações da Saída</h4>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Observações sobre a saída da circulação extracorpórea, intercorrências, dificuldades encontradas, etc."
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ficha de Perfusão</h1>
                <p className="text-sm text-gray-600">Sistema de Registro de Circulação Extracorpórea</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
                <Package className="w-4 h-4 mr-2" />
                Salvar Ficha
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-600 mb-6">
          <span>Ficha de Perfusão</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-blue-600 font-medium">
            {tabs.find(tab => tab.id === activeTab)?.label}
          </span>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Sistema de Ficha de Perfusão - Versão 1.0
            </p>
            <div className="flex space-x-4">
              <button className="text-sm text-gray-600 hover:text-gray-900">
                Ajuda
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-900">
                Suporte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
