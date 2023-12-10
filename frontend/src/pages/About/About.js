import './About.css'
import background from './background-image.jpg';
import { Typography } from '@mui/material';

function About() {
    return (
        <div className='background' style={{ backgroundImage: `url(${background})` }}>
            <div className='text-container'>
                <Typography variant='h2'>About us</Typography>
                <Typography variant='h5'>We are working to allow esports/sports players to receive transparency and guarantees with their contracts.</Typography>
                <Typography variant='h5'>With smart contract technology, we are enabling trustless contracts between players and their organizations.</Typography>
                <Typography variant='h5'>We are hoping to evolve the industry from pen and paper to blockchain.</Typography>
            </div>
        </div>
    );
};
  
export default About;