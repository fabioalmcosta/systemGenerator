import { 
	DataGrid,
	GridToolbar,
	GridColumns,
	ptBR
} from '@mui/x-data-grid';
import { Box, Paper, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material';
import {ITableProps} from '../../types/tableDados.types';
import {  useEffect, useMemo, useState } from 'react';
import AlertConfimModal from '../modal-alerta-confimacao/alertaConfirmacaoModal';
import { Environment } from '../../environment';
import { useDispatch } from 'react-redux';
import { FerramentasDaListagem } from '../ferramentas-da-listagem/ferramentasDaListagem.component';
import { useAppThemeContext } from '../../contexts';
import { CustomNoRowsOverlay } from './noRowsOverlays';
import { LoadingSkeleton } from './tableLoadSkeleton';
import { montaAcoes } from './acoesGridHelper';
import { toast } from 'react-toastify';
import GridContainer from '../../layouts/gridContainer';

export const Table = ({
	columns,
	order,
	filterInit,
	actions,
	options,
	toolbar
}: ITableProps) => {
	
	const dispatch = useDispatch();
	const theme = useTheme();
	const smDown = useMediaQuery(theme.breakpoints.down('sm'));
	const mdDown = useMediaQuery(theme.breakpoints.down('md'));

	const [ contRender, setContRender ] = useState(0);
	const [ data, setData ] = useState([]);
	const [ loadInit, setLoadInit ] = useState(false);
	const [ loadGrid, setLoadGrid ] = useState(false);
	const [ newColumns, setNewColumns ] = useState<GridColumns>([]);
	const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
	const [itemToDelete, setItemToDelete] = useState<any>();
	const { themeName } = useAppThemeContext();
	const [filtroGrid, setFiltroGrid] = useState({page:0,pageSize:10,filter:{}});

	const onConfirmModalDelete = async () => {
		await dispatch(
			itemToDelete.actionDelete({
				id: itemToDelete.id,
				reloadGrid: buscarDadosGrid
			})
		);
		setItemToDelete(undefined);
		setOpenModalDelete(false);
	};

	const onCancelModalDelete = () => {
		setItemToDelete(undefined);
		setOpenModalDelete(false);
	};

	const buscarDadosGrid = async (filtro: any) => {
		console.log('ent');
		await setData([]);
		await setTimeout(() => {
			setLoadGrid(true);
		}, 100);
		
		const response = await options.service(filtro);
		if(response.status === 200){
			await setData(response.data);
			await setLoadGrid(false);
			await setLoadInit(false);
			return true;
		}else {
			await setLoadInit(false);
			return false;
		}
	};

	const montarListaAcoes = async () => {
		const cols: GridColumns = await montaAcoes(
			actions, 
			columns, 
			setItemToDelete, 
			setOpenModalDelete
		);
		setNewColumns(cols);
	};
	
	useEffect( () => {
		async function init(){
			try {
				if(options?.buscarAoRenderizar){
					await setLoadInit(true);
					await buscarDadosGrid(filtroGrid);
				}
				await montarListaAcoes();
			} catch (error: any) {
				toast.error('Erro ao tentar buscar os dados da listagem.');
				await montarListaAcoes();
				await setLoadInit(false);
			}
		}
		init();
	},[]);
	
	useMemo(
		async () => {
			if(contRender > 1){
				console.log('filterGrid',filtroGrid);
				await buscarDadosGrid(filtroGrid);
			}
			setContRender(contRender + 1);
		},
		[filtroGrid],
	);

	return (
		<GridContainer>
			<Box padding={2} display='flex' flexDirection='column' gap={1}>
				{
					options?.titulo &&
					<Box padding={1}  
						display='flex' 
						alignItems="center" 
						gap={1} 
						justifyContent="center" 
						height={theme.spacing(smDown ? 2 : mdDown ? 3 : 5)}
					>
						<Typography 
							whiteSpace="nowrap"
							overflow="hidden"
							textOverflow="ellipsis"
							variant={smDown ? 'h6' : mdDown ? 'h5' : 'h4'}
						>
							{'Listagem de ' + options?.titulo}
						</Typography>
					</Box>
				}
			</Box>
			{
				!options?.ocultarBarraFerramentas &&
				<Box>
					<FerramentasDaListagem
						mostrarBotaoNovo={toolbar?.novo?.route !== (null || '' || undefined)}
						mostrarBotaoAtualizar={toolbar?.exibirAtualizar}
						mostrarInputBusca={false}
						aoClicarBotaoNovo={() => toolbar?.novo?.onClick()}
						aoClicarBotaoAtualizar={() => buscarDadosGrid(filtroGrid)}
						loading={loadInit}
					/>
				</Box>
			}
			{ !loadInit && 
				<Box 
					gap={1}
					padding={2}
					paddingX={2}
					component={Paper}
					display={'flex'}
					sx={{ height: '510px', margin: '0 auto 16px' }}
				>
					<DataGrid 
						rows={data} 
						rowCount={data.length}
						columns={[...newColumns]}
						rowsPerPageOptions={[5, 10, 20, 50, 100]}
						checkboxSelection={options?.selected}
						loading={loadGrid}
						filterMode="server"
						paginationMode="server"
						onFilterModelChange={
							(filterModel) => setFiltroGrid({ 
								...filtroGrid, 
								filter:{
									columnField:filterModel?.items[0]?.columnField, 
									operatorValue:filterModel?.items[0]?.operatorValue, 
									value:filterModel?.items[0]?.value, 
								}})
						}
						onPageChange={(newPage) => setFiltroGrid({...filtroGrid, page:newPage})}
						onPageSizeChange={(newPageSize) => setFiltroGrid({...filtroGrid, pageSize:newPageSize})}
						pagination
						page={filtroGrid.page}
						pageSize={filtroGrid.pageSize}
						initialState={{
							sorting: {
								sortModel: order
							},
							filter: {
								filterModel: {
									items: filterInit
								},
							},
							pagination: {
								pageSize: 10,
							}
						}}
						sx={ themeName === 'light' ? {
							'& .MuiDataGrid-columnHeaders': {
								color: theme.palette.background.paper,
								background: theme.palette.primary.main,
								'& .MuiSvgIcon-root':{
									color: theme.palette.secondary.light
								}
							},
							'& .MuiDataGrid-toolbarContainer':{
								marginTop: '5px'
							}
						} :	{
							'& .MuiDataGrid-columnHeaders': {
								color: theme.palette.text.secondary,
								background: theme.palette.secondary.contrastText,
								'& .MuiSvgIcon-root':{
									color: theme.palette.text.secondary
								}
							},
							'& .MuiDataGrid-toolbarContainer':{
								marginTop: '5px'
							}
						}}
						components={{
							Toolbar: GridToolbar,
							LoadingOverlay: LoadingSkeleton,
							NoRowsOverlay: CustomNoRowsOverlay
						}}
						localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
					/>
				</Box>
			}
			{ loadInit &&
				<Skeleton style={{marginTop: '-6%'}} width={'100%'} height={'600px'}/>
			}
			{
				openModalDelete &&
				<AlertConfimModal
					text={Environment.CONFIRMACAO_DELETE}
					openModal={openModalDelete}
					confirmModalDelete={() => onConfirmModalDelete()}
					cancelModalDelete={() => onCancelModalDelete()}
				/>
			}
		</GridContainer>
	);
};