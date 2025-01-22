import React, { useState } from 'react';
import { HelpOutline, VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import logoPaxVerde from '../../assets/png/logo.png';
import LoadingLogin from '../../components/loading/loading-login';
import { useNavigate } from 'react-router-dom';
import packageJson from '../../../package.json';
import CustomToast from '../../components/toast';
import { formatCPF } from '../../utils/formatCPF';
import './login.css'

const LoginPage = () => {
    const navigate = useNavigate();
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

        const usuario = {
            nome: 'Aderbal',
            id: 1,
            tipo: 1
        }
        sessionStorage.setItem('user', JSON.stringify(usuario));
        
        sessionStorage.setItem('page', '/dashboard');
        navigate('/dashboard');
        // try {
        //     setLoading(true);
        //     const response = await login(cpf, senha);
        //     if (response.status) {
        //         sessionStorage.clear();
        //         const usuario = {
        //             nome: response.data.usuario.nome,
        //             id: response.data.usuario.id,
        //         }
        //         sessionStorage.setItem('user', JSON.stringify(usuario));
        //         sessionStorage.setItem('key', response.data.token);
        //         sessionStorage.setItem('page', '/dashboard');
        //         setUser(usuario);

        //         CustomToast({ type: 'success', message: 'Bem vindo(a)' });
        //         setTimeout(() => {
        //             setCpf("");
        //             setSenha("");
        //             navigate('/dashboard');
        //             setLoading(false);
        //         }, 2000);
        //     } else {
        //         if (response.mensagem && typeof response.mensagem === 'object') {
        //             Object.values(response.mensagem).forEach(mensagem => {
        //                 CustomToast({ type: 'warning', message: mensagem });
        //                 setLoading(false);
        //             });
        //         } else {
        //             CustomToast({ type: 'warning', message: response.mensagem });
        //             setLoading(false);
        //         }
        //     }
        // } catch (error) {
        //     CustomToast({ type: 'error', message: error });
        //     setLoading(false);
        // }
        //teste local


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
