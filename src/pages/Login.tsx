import { useState, type FormEvent, type ChangeEvent, type KeyboardEvent } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const Login = () => {
    const [loginData, setLoginData] = useState({ login: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [capsLockActive, setCapsLockActive] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLoginData((prev: typeof loginData) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.getModifierState('CapsLock')) {
            setCapsLockActive(true);
        } else {
            setCapsLockActive(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/api/Auth/login', loginData);

            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user_name', response.data.name);

            toast.success(`Bem-vindo, ${response.data.name}!`);
            navigate('/register');
        } catch (error: any) {
            console.error(error);
            const status = error.response?.status;
            const data = error.response?.data;
            const msg = data?.message || "Erro de conexão";

            if (status === 400 && (typeof msg === 'string' && msg.toLowerCase().includes('bloqueada'))) {
                setIsBlocked(true);
                toast.error(msg);
            } else if (status === 401) {
                toast.warning(msg);
            } else {
                toast.error(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Acesso ao Sistema</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Login</Form.Label>
                        <Form.Control
                            type="text"
                            name="login"
                            placeholder="Digite seu usuário"
                            value={loginData.login}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Senha</Form.Label>
                        <div className="position-relative">
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Digite sua senha (mínimo 8 caracteres)"
                                value={loginData.password}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                disabled={isBlocked}
                                minLength={8}
                                required
                            />
                            {capsLockActive && (
                                <div className="caps-lock-warning">
                                    <i className="bi bi-exclamation-triangle-fill me-1"></i>
                                    Caps Lock Ativado
                                </div>
                            )}
                        </div>
                    </Form.Group>

                    <div className="d-grid gap-2">
                        <Button className="btn-premium" type="submit" disabled={loading || isBlocked}>
                            {loading ? <Spinner size="sm" animation="border" /> : 'Entrar no Sistema'}
                        </Button>
                        {isBlocked && (
                            <Button variant="outline-danger" className="mt-2">
                                Esqueci minha senha
                            </Button>
                        )}
                    </div>
                </Form>
                <div className="text-center mt-4">
                    <small className="text-muted">
                        Ainda não tem uma conta? <Link to="/register" className="text-decoration-none fw-bold" style={{ color: '#764ba2' }}>Cadastre-se aqui</Link>
                    </small>
                </div>
            </div>
        </div>
    );
};

export default Login;