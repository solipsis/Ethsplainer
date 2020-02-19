require('typeface-press-start-2p')
import Home from './Home'
import { ThemeProvider } from '@chakra-ui/core'

const App = () => {
    return (
        <ThemeProvider>
            <Home />
        </ThemeProvider>
    )
}

export default App
