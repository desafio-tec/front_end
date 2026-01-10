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
    const [errors, setErrors] = useState({ login: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));
        // Limpa erro ao digitar
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
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

        if (loginData.password.length < 8) {
            setErrors(prev => ({ ...prev, password: 'A senha deve ter pelo menos 8 caracteres.' }));
            return;
        }

        setLoading(true);
        setErrors({ login: '', password: '' });

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
                setErrors(prev => ({ ...prev, login: msg }));
                toast.error(msg);
            } else if (status === 401) {
                // Senha incorreta ou usuário não encontrado
                setErrors(prev => ({ ...prev, password: msg }));
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
                            isInvalid={!!errors.login}
                            isValid={loginData.login.length >= 3}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.login}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Senha</Form.Label>
                        <div className="position-relative">
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Digite sua senha"
                                value={loginData.password}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                disabled={isBlocked}
                                isInvalid={!!errors.password}
                                isValid={loginData.password.length >= 8}
                                required
                            />
                            {capsLockActive && (
                                <div className="caps-lock-warning">
                                    <i className="bi bi-exclamation-triangle-fill me-1"></i>
                                    Caps Lock Ativado
                                </div>
                            )}
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                            <small className={`mt-1 d-block ${loginData.password.length > 0 && loginData.password.length < 8 ? 'text-danger' : 'text-muted'}`} style={{ fontSize: '0.75rem' }}>
                                Mínimo 8 caracteres
                            </small>
                        </div>
                    </Form.Group>

                    <div className="d-grid gap-2">
                        <Button className="btn-premium" type="submit" disabled={loading || isBlocked || loginData.password.length < 8}>
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