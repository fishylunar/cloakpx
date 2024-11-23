import { FaGithub } from 'react-icons/fa'
import viteSvg from '@/assets/vite.svg'
import tsSvg from '@/assets/ts.svg'
import reactSvg from '@/assets/react.svg'

function Footer() {
	return (
		<footer className='bg-background text-foreground py-6'>
			<div className='container mx-auto px-4'>
				<div className='w-full flex items-center'>
					<span className='text-lg font-medium pr-3 w-full'>Made with ❤️</span>
				</div>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-4'>
						<img
							alt='React Logo'
							src={reactSvg}
							width={20}
							height={20}
							className='text-primary'
						/>
						<img
							alt='Vite Logo'
							src={viteSvg}
							width={20}
							height={20}
							className='text-primary'
						/>
						<span className='text-lg font-medium'>and</span>
						<img
							alt='TypeScript Logo'
							src={tsSvg}
							width={20}
							height={20}
							className='text-primary'
						/>
					</div>
				</div>
				<div className='flex items-center space-x-4 w-full'>
					<span className='text-lg font-medium'>by</span>
					<FaGithub size={20} className='text-primary' />
					<a
						href='https://github.com/fishylunar/cloakpx'
						target='_blank'
						rel='noopener noreferrer'
						className='text-primary text-lg font-medium hover:text-accent/60 transition-colors'
					>
						fishylunar
					</a>
				</div>
			</div>
		</footer>
	)
}

export default Footer
