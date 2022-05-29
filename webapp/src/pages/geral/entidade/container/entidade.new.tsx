
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../../store';
import { EntidadeForm } from '../components/entidade.form';
import { urlBase } from '../entidade.route';
import { createEntidade } from '../store/entidade.request';

export const EntidadeNew: React.FC = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const onSubmit = (dados: any) => {
		createEntidade(dados, dispatch, navigate(urlBase));
	};

	return <EntidadeForm onSubmit={onSubmit} prefix='I' />;
};