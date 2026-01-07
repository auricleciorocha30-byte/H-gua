
import React from 'react';
import { CloudDownload, CloudUpload, ShieldCheck, Database, FileJson, AlertCircle, RefreshCw } from 'lucide-react';
import { AppState } from '../types';

interface SettingsProps {
  state: AppState;
  onRestore: (newState: AppState) => void;
}

const Settings: React.FC<SettingsProps> = ({ state, onRestore }) => {
  const [isRestoring, setIsRestoring] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `h-agua-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    setSuccess('Backup gerado e baixado com sucesso!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        // Validação básica
        if (json.clients && json.products) {
          onRestore(json);
          setSuccess('Dados restaurados com sucesso!');
        } else {
          alert('Arquivo de backup inválido.');
        }
      } catch (err) {
        alert('Erro ao ler arquivo JSON.');
      } finally {
        setIsRestoring(false);
        setTimeout(() => setSuccess(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-gray-900">Configurações do Sistema</h2>
        <p className="text-gray-500 font-medium">Gerencie seus dados e backups da revenda.</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-2xl flex items-center gap-3 text-green-700 animate-in fade-in slide-in-from-top-4">
          <ShieldCheck size={20} />
          <span className="font-bold text-sm">{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup Card */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
            <CloudDownload size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Backup de Segurança</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
            Baixe uma cópia completa de todos os seus dados: clientes, histórico de vendas, estoque e entregas. Recomendamos fazer isso semanalmente.
          </p>
          <button 
            onClick={handleBackup}
            className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2"
          >
            <FileJson size={20} />
            Fazer Backup Agora
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <CloudUpload size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Restaurar Dados</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
            Importe um arquivo de backup anterior para restaurar seu sistema. <span className="text-red-500 font-bold">Atenção:</span> Isso apagará os dados atuais.
          </p>
          <label className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 cursor-pointer text-center">
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              onChange={handleFileChange} 
              disabled={isRestoring}
            />
            {isRestoring ? <RefreshCw size={20} className="animate-spin" /> : <Database size={20} />}
            {isRestoring ? 'Processando...' : 'Selecionar Arquivo'}
          </label>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl flex gap-4">
        <AlertCircle className="text-orange-500 shrink-0" size={24} />
        <div>
          <h4 className="font-bold text-orange-800 text-sm uppercase mb-1">Dica de Segurança</h4>
          <p className="text-xs text-orange-700 leading-relaxed">
            Seus dados são armazenados apenas neste navegador. Limpar o cache ou formatar o dispositivo resultará em perda de dados se você não tiver um backup recente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
