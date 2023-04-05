
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { InputField } from '@/components/InputField';
import { useAppContext } from '@/contexts/app';
import { useApi } from '@/libs/useApi';
import { Tenant } from '@/types/Tenant';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../../styles/Login.module.css';
import { useAuthContext } from '@/contexts/auth';

const Login = (data: Props) => {
  const { setToken, setUser} = useAuthContext();

  const { tenant, setTenant } = useAppContext();

  useEffect(()=>{
    setTenant(data.tenant);
  }, []);

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    setToken('1234');
    setUser({
      name: 'Bonieky',
      email: 'supporte@b7web.com.br'
    });
    router.push(`/${data.tenant.slug}`);
  }

  const handleSignUp = () => {
    router.push(`/${data.tenant.slug}/signup`);
  }
  
  return (
    <div className={styles.container}>
        <Head>
            <title>Login | {data.tenant.name}</title>
        </Head>

        <Header color={data.tenant.mainColor} backHref={`/${data.tenant.slug}`}/>

        <div className={styles.header}>{data.tenant.name}</div>

        <div 
          className={styles.subtitle}
          style={{ borderBottomColor: data.tenant.mainColor }}
        >Use suas credenciais para realizar o login.</div>
        <div className={styles.line}></div>

        <div className={styles.formArea}>

          <div className={styles.inputArea}>
            <InputField
              color={data.tenant.mainColor}
              placeholder="Digite seu e-mail"
              value={email}
              onChange={setEmail}
            />
          </div>

          <div className={styles.inputArea}>
            <InputField
              color={data.tenant.mainColor}
              placeholder="Digite sua senha"
              value={password}
              onChange={setPassword}
              password
            />
          </div>

          <div className={styles.inputArea}>
            <Button 
              color={data.tenant.mainColor}
              label="Entrar"
              onClick={handleSubmit}
              fill
            />
          </div>
        </div>

        <div 
          className={styles.forgetArea}
          style={{ borderBottomColor: data.tenant.mainColor }}
        >
          Esqueceu sua senha? <Link legacyBehavior href={`/${data.tenant.slug}/forget`}><a style={{color: data.tenant.mainColor}}>Clique aqui</a></Link>  
        </div>
        <div className={styles.line}></div>

        <div className={styles.signupArea}>
          <Button 
                color={data.tenant.mainColor}
                label="Quero me cadastrar"
                onClick={handleSignUp}
          />
        </div>

    </div>
  )
}
export default Login;

type Props = {
  tenant: Tenant;  
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  
  const { tenant: tenantSlug } = context.query;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const api = useApi(tenantSlug as string);

  //Get Tenant
  
  const tenant = await api.getTenant();
  if(!tenant){
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return{
    props: {
      tenant
    }
  }

}