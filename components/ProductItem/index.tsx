import { useAppContext } from '@/contexts/app';
import { useFormatter } from '@/libs/useFormatter';
import { Product } from '@/types/Product';
import Link from 'next/link';
import { type } from 'os';
import styles from './styles.module.css';

type Props = {
    data: Product;
}

export const ProductItem = ({ data }: Props) => {
    const { tenant } = useAppContext();
    const formatter = useFormatter();

    return(
        <Link legacyBehavior href={`/${tenant?.slug}/product/${data.id}`}>
        <a className={styles.container}>
            <div className={styles.head} style={{backgroundColor: tenant?.secondColor}}></div>
            <div className={styles.info}>
                <div className={styles.img}>
                    <img src={data.image} alt=''/>
                </div>
                <div className={styles.catName}>{data.categoryName}</div>
                <div className={styles.name}>{data.name}</div>
                <div className={styles.price} style={{color: tenant?.mainColor}}>{formatter.formatPrice(data.price)}</div>
            </div>
        </a>
        </Link>
    )
}