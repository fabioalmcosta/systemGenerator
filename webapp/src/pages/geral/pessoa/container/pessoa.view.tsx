import { useEffect, useState } from 'react';
import { PaginaFormLayout } from '../../../../shared/layouts';


type Props = {
	titulo?: string,
	children: React.ReactNode;
	loadingInicial?: boolean;
	propsBarraDetalhes?: any;
    exibirBarraDetalhes?: boolean;
  };

const prefix = 'V';

export const PessoaView: React.FC<Props> = (props) => {
	console.log('props form',props);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 5000);
		
	},[]);

	return(
		<PaginaFormLayout 
			titulo={props?.titulo}
			propsBarraDetalhes={props?.propsBarraDetalhes}
			loadingInicial={loading}
			prefix={prefix}
		>
			{props.children}
		</PaginaFormLayout>
	);
};