import { Box, IconButton, Tooltip, useTheme, Divider, Skeleton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SyncIcon from '@mui/icons-material/Sync';
interface IFerramentasDaListagemProps {
    textoDaBusca?: string;
    mostrarInputBusca?: boolean;
    aoMudarTextoDeBusca?: (novoTexto: string) => void;
	textoBotaoNovo?: string;
	mostrarBotaoNovo?: boolean;
	aoClicarBotaoNovo?: () => void;
	mostrarBotaoAtualizar?: boolean;
	aoClicarBotaoAtualizar?: () => void;
	loading?: boolean
}

export const FerramentasDaListagem: React.FC<IFerramentasDaListagemProps> = ({
	textoBotaoNovo = 'Novo',
	mostrarBotaoNovo = true,
	aoClicarBotaoNovo,
	mostrarBotaoAtualizar = true,
	aoClicarBotaoAtualizar,
	loading = false
}) => {

	const theme = useTheme();

	return (
		<>
			<Box 
				gap={1}
				padding={2}
				paddingX={2}
				display='flex'
				alignItems={'center'}
				height={theme.spacing(2)} 
			>
				<Box flex={1} display="flex" justifyContent="end">
					{!loading && mostrarBotaoAtualizar && 
						<>
						
							<Box display={'flex'}>
								<Tooltip title={'Atualizar'}>
									<IconButton
										color="primary"
										style={{padding: '2px'}}
										onClick={aoClicarBotaoAtualizar}
									>
										<SyncIcon/>
									</IconButton>
								</Tooltip>
								{
									mostrarBotaoNovo &&
									<Divider orientation='vertical' style={{marginLeft:'10px', marginRight: '10px'}}/>
								}
							</Box>
						</>
					}
					{loading && (
						<>
							<Box display={'flex'}>
								<Skeleton width={'40px'} style={{padding: '0,2px'}} height={'40px'} variant="circular"/>
								<Divider orientation='vertical' style={{marginLeft:'10px', marginRight: '10px'}}/>
							</Box>
						</>
					)}
					{!loading && mostrarBotaoNovo && (
						<Tooltip title={textoBotaoNovo}>
							<IconButton
								color="primary"
								style={{padding: '2px'}}
								onClick={aoClicarBotaoNovo}
							>
								<AddIcon/>
							</IconButton>
						</Tooltip>
					)}
					{loading && (
						<>
							<Box display={'flex'}>
								<Skeleton width={'40px'} style={{padding: '0,2px'}} height={'40px'} variant="circular"/>
							</Box>
						</>
					)}
				</Box>
			</Box>
		</>
	);
};