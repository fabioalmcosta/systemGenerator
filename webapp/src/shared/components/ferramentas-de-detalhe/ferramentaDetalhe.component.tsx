import { Box, Divider, Fab, Skeleton, Tooltip, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VoltarIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import { red } from '@mui/material/colors';
import { IFerramentasDeDetalhesProps } from '../../types/formDados.types';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Environment } from '../../environment';
import AlertConfimModal from '../modal-alerta-confimacao/alertaConfirmacaoModal';
import { useState } from 'react';

export const FerramentasDeDetalhes: React.FC<IFerramentasDeDetalhesProps> = ({
	textoBotaoNovo = 'Novo',
	textoBotaoEditar = 'Editar',
	textoBotaoSalvar,
	exibeBotaoNovo = false,
	exibeBotaoSalvar = true,
	exibeBotaoExcluir = true,
	exibeBotaoVoltar = true,
	exibeBotaoEditar = true,
	onClickSalvar,
	onClickNovo,
	onClickVoltar,
	onClickEditar,
	onClickExcluir,
	loading = false,
	urlListagem,
	prefix
}) => {

	const theme = useTheme();
	const navigate = useNavigate();
	const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

	const { id } = useParams();

	const textoSalvar = textoBotaoSalvar ? textoBotaoSalvar : 
		prefix === 'I' ? 'Cadastrar' : 'Salvar';

	const onConfirmModalDelete = async () => {
		const response = await onClickExcluir();
		if(response.status === 204){
			navigate(-1);
			toast.success(Environment.EXCLUIDO_COM_SUCESSO);
		}else {
			toast.error(Environment.ERRO_AO_DELETAR);
		}
		setOpenModalDelete(false);
	};

	const onCancelModalDelete = () => {
		setOpenModalDelete(false);
	};

	return (
		<Box 
			padding={1.5}
			display='flex'
			alignItems={'center'}
			justifyContent={'end'}
		>
			<Box 
				gap={1}
				padding={1.5}
				paddingX={1}
				display='flex'
				alignItems={'center'}
				height={theme.spacing(2)}
				width={'max-content'}
			>
				{(prefix !== 'I' && exibeBotaoExcluir && !loading) && (
					<>
						<Tooltip title={'Excluir'} placement="top">
							<Fab 
								size="small" 
								aria-label="remove" 
								style={{width: '35px', height: '20%', background: red[700], color:'white'}}
								onClick={() => setOpenModalDelete(true)}
							>
								<DeleteIcon/>
							</Fab>
						</Tooltip>
					</>
				)}
				{loading && (
					<>
						<Skeleton width={'40px'} height={'40px'} variant="circular"/>
						<Divider orientation='vertical'/>
					</>
				)}
				{(exibeBotaoSalvar && !loading && prefix !== 'V') && (
					console.log('id: ', id),
					console.log('onClickEditar: ', onClickEditar),
					<>
						<Tooltip title={textoSalvar} placement="top">
							
							<Fab 
								size="small" 
								aria-label="save" 
								style={{width: '35px', height: '20%'}}
								//onClick={id ? onClickSalvar : onClickEditar}
								
							>
								<SaveIcon/>
							</Fab>
						</Tooltip>

					</>
				)}
				{loading && (
					<>
						<Skeleton width={'40px'} height={'40px'} variant="circular"/>
						<Divider orientation='vertical'/>
					</>
				)}
				{(exibeBotaoEditar && !loading && prefix === 'V') && (
					<>
						<Tooltip title={textoBotaoEditar} placement="top">
							<Fab 
								size="small" 
								aria-label="edit" 
								style={{width: '35px', height: '20%'}}
								onClick={onClickEditar}
							>
								<EditIcon/>
							</Fab>
						</Tooltip>
					</>
				)}
				{loading && (
					<>
						<Skeleton width={'40px'} height={'40px'} variant="circular"/>
						<Divider orientation='vertical'/>
					</>
				)}
				{(exibeBotaoNovo && !loading) && (
					<>
						<Tooltip title={textoBotaoNovo} placement="top">
							<Fab 
								size="small" 
								aria-label="new" 
								style={{width: '35px', height: '20%'}}
								onClick={onClickNovo}
							>
								<AddIcon/>
							</Fab>
						</Tooltip>
					</>
				)}
				{loading && (
					<>
						<Skeleton width={'40px'} height={'40px'} variant="circular"/>
						<Divider orientation='vertical'/>
					</>
				)}
				{(exibeBotaoVoltar && !loading) && (
					<>
						<Tooltip title={'Voltar'} placement="top">
							<Fab 
								size="small" 
								aria-label="back" 
								style={{width: '35px', height: '20%'}}
								onClick={onClickVoltar ? onClickVoltar : urlListagem ? () => navigate(urlListagem) : () => navigate(-1)}
							>
								<VoltarIcon/>
							</Fab>
						</Tooltip>
					</>
				)}
				{loading && (
					<Skeleton width={'40px'} height={'40px'} variant="circular"/>
				)}
			</Box>
			{
				openModalDelete &&
				<AlertConfimModal
					text={Environment.CONFIRMACAO_DELETE}
					openModal={openModalDelete}
					confirmModalDelete={() => onConfirmModalDelete()}
					cancelModalDelete={() => onCancelModalDelete()}
				/>
			}
		</Box>
	);
};