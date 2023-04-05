import Card from './card.svg';
import Checked from './checked.svg';
import Cupom from './cupom.svg';
import Location from './location.svg';
import MailSent from './mailSent.svg';
import Money from './money.svg';
import RightArrow from './rightarrow.svg';
import Dots from './dots.svg';
import Edit from './edit.svg';
import Delete from './delete.svg';

type Props = {
    svg: string;
    color: string;
    width: number;
    height: number;
}

export const Icon = ({ svg, color, width, height }: Props) => {
    return (
        <div style={{ width, height }}>
            {svg === 'card' && <Card color={color}/>}
            {svg === 'checked' && <Checked color={color}/>}
            {svg === 'cupom' && <Cupom color={color}/>}
            {svg === 'location' && <Location color={color}/>}
            {svg === 'mailsent' && <MailSent color={color}/>}
            {svg === 'money' && <Money color={color}/>}
            {svg === 'rightarrow' && <RightArrow color={color}/>}
            {svg === 'dots' && <Dots color={color}/>}
            {svg === 'edit' && <Edit color={color}/>}
            {svg === 'delete' && <Delete color={color}/>}
        </div>
    )
}