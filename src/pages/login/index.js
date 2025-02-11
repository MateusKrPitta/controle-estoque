import React, { useState } from 'react';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import logoPaxVerde from '../../assets/png/logo.png';
import LoadingLogin from '../../components/loading/loading-login';
import { useNavigate } from 'react-router-dom';
import packageJson from '../../../package.json';
import CustomToast from '../../components/toast';
import { formatCPF } from '../../utils/formatCPF';
import './login.css'
import api from '../../services/api';
import { useUnidade } from '../../components/unidade-context';

const LoginPage = () => {
    const navigate = useNavigate();
    const { setUnidadeId, setUnidadeNome } = useUnidade();  // Acessa as funções do contexto
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);

    const handleCPFChange = (e) => {
        const { value } = e.target;
        if (value.length <= 14) {
            setCpf(formatCPF(value));
        }
    };

    const handleSenhaChange = (e) => {
        setSenha(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            logar();
        }
    };

    const logar = async () => {
        if (!cpf) {
          CustomToast({ type: 'warning', message: 'Informe o CPF!' });
          return;
        }
        if (!senha) {
          CustomToast({ type: 'warning', message: 'Informe sua senha!' });
          return;
        }
      
        setLoading(true);
      
        try {
          const response = await api.post('/login', { cpf, senha });
          const { token, nome, unidade } = response.data.data;
      
          if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('userName', nome);
      
            if (unidade && unidade.length > 0) {
              const unidadeSelecionada = unidade[0];
              setUnidadeId(unidadeSelecionada.id);
              setUnidadeNome(unidadeSelecionada.nome);
      
              // Salva unidadeId e unidadeNome no localStorage
              localStorage.setItem('unidadeId', unidadeSelecionada.id);
              localStorage.setItem('unidadeNome', unidadeSelecionada.nome);
            }
      
            CustomToast({ type: 'success', message: `Bem-vindo(a), ${nome}` });
            setTimeout(() => {
              setCpf('');
              setSenha('');
              setLoading(false);
              navigate('/dashboard');
            }, 1000);
          }
        } catch (error) {
          setLoading(false);
          if (error.response && error.response.data.message) {
            CustomToast({ type: 'warning', message: error.response.data.message });
          } else {
            CustomToast({ type: 'error', message: 'Erro ao fazer login. Tente novamente mais tarde.' });
          }
        }
      };
      

    return (
        <div className="login-container flex h-screen items-center justify-center ">
            <div className="relative bg-black p-8 rounded-lg shadow-lg max-w-md w-full z-10">
                <div className="flex justify-center mb-10">
                    <img src={logoPaxVerde} alt="Logo Pax Verde" className="w-28" />
                </div>
                <input
                    type="text"
                    value={cpf}
                    onChange={handleCPFChange}
                    onKeyDown={handleKeyDown}
                    placeholder="CPF"
                    autoComplete='off'
                    className="cpf-input w-full p-3 mb-4 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="relative w-full mb-4">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={senha}
                        onChange={handleSenhaChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Senha"
                        className="password-input w-full p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div
                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer opacity-25"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? <VisibilityOffOutlined size={24} /> : <VisibilityOutlined size={24} />}
                    </div>
                </div>
                <button
                    onClick={logar}
                    style={{backgroundColor:'#9EBB51'}}
                    className="login-button w-full text-white p-2 rounded-md bg-custom-green"
                >
                    {loading ? <LoadingLogin /> : 'Entrar'}
                </button>

                <div className="tutorial text-center mt-3" style={{color:'#9EBB51'}}>
                    <p>Precisa de ajuda?
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            setShowTutorial(true);
                        }}
                            style={{ textDecoration: 'underline', color: '#9EBB51', cursor: 'pointer' }}
                        >Iniciar tutorial
                        </a>
                    </p>
                </div>
                <div className="versao-app text-center mt-10">
                    <p> Versão {packageJson.version}</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
