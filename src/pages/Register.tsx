import { useState, type FormEvent, type ChangeEvent } from 'react';
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
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (formData.password.length < 6) {
            toast.warning("A senha deve ter no mínimo 6 caracteres.");
            return;
        }

        setLoading(true);

        try {
            await api.post('/api/Auth/register', formData);
            toast.success("Usuário cadastrado com sucesso!");
            navigate('/');
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data || "Erro ao realizar cadastro.";
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
                            required
                        />
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Usuário (Login)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="login"
                                    placeholder="Escolha um usuário"
                                    value={formData.login}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Senha</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Min. 6 caracteres"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-grid gap-2 mt-4">
                        <Button className="btn-premium" type="submit" disabled={loading}>
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