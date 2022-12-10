import { useContext } from 'react';
import AppContext from './AppContext'

const MacPackExporter = () => {
    const context = useContext(AppContext);
    console.log('editor');
    console.log(context.state);
    console.log(context.setState);
    return ()}
