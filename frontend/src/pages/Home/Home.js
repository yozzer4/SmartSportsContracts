import { Typography } from '@mui/material';
import './Home.css'
import background from './background-image.jpg';

function Home() {
    return (
        <div className='background' style={{ backgroundImage: `url(${background})` }}>
            <div className='text-container'>
                <Typography variant='h1'>Better contracts.</Typography>
                <Typography variant='h2'>For everyone.</Typography>
            </div>
        </div>
    );
};
  
export default Home;