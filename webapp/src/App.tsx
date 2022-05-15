/* eslint-disable no-mixed-spaces-and-tabs */
import { BrowserRouter } from 'react-router-dom';
import { MenuLateral } from './shared/components';
import { AppDrawerProvider, AppThemeProvider } from './shared/contexts';
import { SnackbarProvider } from 'notistack';
import { Router } from './routes/index.route';

export const App = () => {
	return (
		<AppThemeProvider>
			<BrowserRouter>
				<AppDrawerProvider>
					<MenuLateral >
						<SnackbarProvider  maxSnack={3} autoHideDuration={5000}>
							<Router />
						</SnackbarProvider>
					</MenuLateral>
				</AppDrawerProvider>
			</BrowserRouter>
		</AppThemeProvider>
	);
};
