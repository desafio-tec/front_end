import { useState, useEffect, useCallback, type FormEvent, type ChangeEvent } from 'react';
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        login: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    // Estado inicial neutro para não exibir erro ao carregar a página
    const [loginStatus, setLoginStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

    const [apiErrors, setApiErrors] = useState({ general: '', login: '', password: '', name: '' });
    const navigate = useNavigate();

    // Verificação de disponibilidade de login no Render
    const checkLoginAvailability = useCallback(async (login: string) => {
        if (!login || login.trim().length < 3) {
            setLoginStatus('idle');
            return;
        }

        setLoginStatus('checking');
        try {
            const response = await api.get(`/api/Auth/check-login?login=${login}`);
            const isAvailable = response.data === true || response.data?.available === true;

            if (isAvailable) {
                setLoginStatus('available');
            } else {
                setLoginStatus('taken');
            }
        } catch (error) {
            console.error("Erro na verificação:", error);
            setLoginStatus('idle');
        }
    }, []);

    useEffect(() => {
        if (formData.login.length >= 3) {
            const timer = setTimeout(() => {
                checkLoginAvailability(formData.login);
            }, 600);
            return () => clearTimeout(timer);
        } else {
            setLoginStatus('idle');
        }
    }, [formData.login, checkLoginAvailability]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setApiErrors(prev => ({ ...prev, [name]: '', general: '' }));

        if (name === 'login' && value.length < 3) {
            setLoginStatus('idle');
        }

        if (name === 'name') {
            if (value.trim() && !value.trim().includes(' ')) {
                setApiErrors(prev => ({ ...prev, name: 'Insira nome e sobrenome' }));
            } else {
                setApiErrors(prev => ({ ...prev, name: '' }));
            }
        }
    };

    // VALIDAÇÃO CORRIGIDA: Libera o botão se os campos estiverem preenchidos corretamente
    const isFormValid =
        formData.name.trim().includes(' ') &&
        formData.password.length >= 8 &&
        formData.login.length >= 3 &&
        loginStatus !== 'taken' && // Impede o envio apenas se o erro de duplicidade for confirmado
        !loading;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        setLoading(true);
        setApiErrors({ general: '', login: '', password: '', name: '' });

        try {
            await api.post('/api/Auth/register', formData);
            toast.success("Usuário cadastrado com sucesso!");
            navigate('/');
        } catch (error: any) {
            const data = error.response?.data;
            const msg = data?.message || "Erro ao realizar cadastro.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card" style={{ maxWidth: '550px' }}>
                <h2 className="auth-title">Criar Nova Conta</h2>
                <Form onSubmit={handleSubmit} noValidate>
                    <Form.Group className="mb-3">
                        <Form.Label>Nome Completo</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Nome e Sobrenome"
                            value={formData.name}
                            onChange={handleChange}
                            isInvalid={!!apiErrors.name}
                            isValid={formData.name.trim().includes(' ')}
                        />
                        <Form.Control.Feedback type="invalid">{apiErrors.name}</Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Usuário (Login)</Form.Label>
                                <div className="position-relative">
                                    <Form.Control
                                        type="text"
                                        name="login"
                                        placeholder="Login"
                                        value={formData.login}
                                        onChange={handleChange}
                                        // O erro só aparece se houver 3+ letras e o status for 'taken'
                                        isInvalid={formData.login.length >= 3 && loginStatus === 'taken'}
                                        isValid={loginStatus === 'available'}
                                    />
                                    {loginStatus === 'checking' && (
                                        <div className="position-absolute end-0 top-50 translate-middle-y me-2">
                                            <Spinner size="sm" animation="border" />
                                        </div>
                                    )}
                                    <Form.Control.Feedback type="invalid" style={{ display: loginStatus === 'taken' ? 'block' : 'none' }}>
                                        Este login já está em uso.
                                    </Form.Control.Feedback>
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Senha</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Mínimo 8 caracteres" // Placeholder atualizado
                                    value={formData.password}
                                    onChange={handleChange}
                                    isValid={formData.password.length >= 8}
                                />
                                <small className="text-muted d-block mt-1" style={{ fontSize: '0.70rem' }}>
                                    Pelo menos 8 caracteres
                                </small>
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-grid gap-2 mt-4">
                        {/* Botão agora ativa corretamente ao cumprir os requisitos */}
                        <Button className="btn-premium" type="submit" disabled={!isFormValid}>
                            {loading ? <Spinner size="sm" animation="border" /> : 'Finalizar Cadastro'}
                        </Button>
                        <Link to="/" className="btn btn-link text-decoration-none text-muted mt-2">
                            Já possui conta? <span style={{ color: '#764ba2', fontWeight: '600' }}>Voltar para o Login</span>
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Register;