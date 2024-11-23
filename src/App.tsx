import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import './App.css'
import EncodeTabContent from './views/tabs/EncodeTabContent'
import DecodeTabContent from './views/tabs/DecodeTabContent'
import { ThemeProvider } from '@/components/ui/theme-provider'
import Footer from './views/Footer'
function App() {
	return (
		<>
			<ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
				<img
					className='w-16 h-16 rounded-full mt-2 mb-2'
					src='/icon-512-maskable.png'
					alt='CloakPX logo'
				/>
				<h1 className='text-pretty font-bold text-4xl pb-8 pt-0 mb-2'>
					Welcome to CloakPX
				</h1>
				<Tabs defaultValue='encode' className='w-[400px] pb-4'>
					<TabsList className='grid w-full grid-cols-2 rounded-xl'>
						<TabsTrigger className='rounded-xl' value='encode'>
							Encode
						</TabsTrigger>
						<TabsTrigger className='rounded-xl' value='decode'>
							Decode
						</TabsTrigger>
					</TabsList>

					{/* Encode tab */}
					<TabsContent value='encode' className='pt-4'>
						<EncodeTabContent />
					</TabsContent>

					{/* Decode tab */}
					<TabsContent value='decode' className='pt-4'>
						<DecodeTabContent />
					</TabsContent>
				</Tabs>
				<Footer />
			</ThemeProvider>
		</>
	)
}

export default App
