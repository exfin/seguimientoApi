import { playerDB } from "../models/player.nodel";
import './styles/Player.css'

interface playerProps{
    player: playerDB;
}

export const Player = ({player}:playerProps) =>{
    return(
        <div className="player-name">
            <p className="first-name">- {player.first_name}</p>
            <p className="last-name">{player.last_name}</p>
        </div>


    );
}