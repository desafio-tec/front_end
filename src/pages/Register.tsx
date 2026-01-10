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
    const [loginStatus, setLoginStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        upper: false,
        number: false
    });
    const [apiErrors, setApiErrors] = useState({ general: '', login: '', password: '', name: '' });
    const navigate = useNavigate();

    // Debounced login check
    const checkLoginAvailability = useCallback(async (login: string) => {
        if (!login || login.length < 3) {
            setLoginStatus('idle');
            return;
        }
        setLoginStatus('checking');
        try {
            const response = await api.get(`/api/Auth/check-login?login=${login}`);
            if (response.data === true || response.data?.available === true) {
                setLoginStatus('available');
            } else {
                setLoginStatus('taken');
            }
        } catch (error) {
            console.error("Erro ao verificar login:", error);
            setLoginStatus('taken');
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (formData.login) {
                checkLoginAvailability(formData.login);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [formData.login, checkLoginAvailability]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear API errors when user types
        setApiErrors(prev => ({ ...prev, [name]: '', general: '' }));

        if (name === 'name') {
            if (value.trim() && !value.trim().includes(' ')) {
                setApiErrors(prev => ({ ...prev, name: 'Por favor, insira seu nome e sobrenome' }));
            } else {
                setApiErrors(prev => ({ ...prev, name: '' }));
            }
        }

        if (name === 'password') {
            setPasswordCriteria({
                length: value.length >= 8,
                upper: /[A-Z]/.test(value),
                number: /[0-9]/.test(value)
            });
        }
    };

    const isPasswordValid = passwordCriteria.length && passwordCriteria.upper && passwordCriteria.number;
    const isFormValid = formData.name.trim().includes(' ') && isPasswordValid && loginStatus === 'available' && !loading;

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
            console.error(error);
            const data = error.response?.data;
            const msg = data?.message || (typeof data === 'string' ? data : "Erro ao realizar cadastro.");

            // Try to map error to fields if possible
            if (typeof msg === 'string') {
                if (msg.toLowerCase().includes('login')) {
                    setApiErrors(prev => ({ ...prev, login: msg }));
                } else if (msg.toLowerCase().includes('senha') || msg.toLowerCase().includes('password')) {
                    setApiErrors(prev => ({ ...prev, password: msg }));
                } else {
                    setApiErrors(prev => ({ ...prev, general: msg }));
                }
            }

            toast.error(typeof msg === 'string' ? msg : "Erro no cadastro.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card" style={{ maxWidth: '550px' }}>
                <h2 className="auth-title">Criar Nova Conta</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nome Completo</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Digite seu nome completo"
                            value={formData.name}
                            onChange={handleChange}
                            isInvalid={!!apiErrors.name}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {apiErrors.name}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Usuário (Login)</Form.Label>
                                <div className="position-relative">
                                    <Form.Control
                                        type="text"
                                        name="login"
                                        placeholder="Escolha um usuário"
                                        value={formData.login}
                                        onChange={handleChange}
                                        isInvalid={loginStatus === 'taken' || !!apiErrors.login}
                                        isValid={loginStatus === 'available'}
                                        required
                                    />
                                    {loginStatus === 'checking' && (
                                        <div className="position-absolute end-0 top-50 translate-middle-y me-2">
                                            <Spinner size="sm" animation="border" />
                                        </div>
                                    )}
                                    <Form.Control.Feedback type="invalid">
                                        {apiErrors.login || "Este login já está em uso."}
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
                                    placeholder="Min. 8 caracteres"
                                    value={formData.password}
                                    onChange={handleChange}
                                    isInvalid={!!apiErrors.password}
                                    required
                                />
                                {apiErrors.password && (
                                    <Form.Control.Feedback type="invalid">
                                        {apiErrors.password}
                                    </Form.Control.Feedback>
                                )}
                                <div className="password-strength-meter mt-2">
                                    <div className="d-flex gap-2">
                                        <div className={`strength-dot ${passwordCriteria.length ? 'valid' : ''}`} title="Mínimo 8 caracteres"></div>
                                        <div className={`strength-dot ${passwordCriteria.upper ? 'valid' : ''}`} title="Pelo menos uma maiúscula"></div>
                                        <div className={`strength-dot ${passwordCriteria.number ? 'valid' : ''}`} title="Pelo menos um número"></div>
                                    </div>
                                    <small className="text-muted d-block mt-1" style={{ fontSize: '0.75rem' }}>
                                        8+ chars, Maiúscula, Número
                                    </small>
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-grid gap-2 mt-4">
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