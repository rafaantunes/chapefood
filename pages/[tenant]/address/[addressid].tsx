import { useAppContext } from '@/contexts/app';
import { useApi } from '@/libs/useApi';
import { Tenant } from '@/types/Tenant';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import styles from '../../../styles/NewAddress.module.css';
import { getCookie, setCookie } from 'cookies-next';
import { User } from '@/types/User';
import { useAuthContext } from '@/contexts/auth';
import { Header } from '@/components/Header';
import Head from 'next/head';
import { useFormatter } from '@/libs/useFormatter';
import { CartItem } from '@/types/CartItem';
import { useRouter } from 'next/router';
import { Button } from '@/components/Button';
import { Address } from '@/types/Address';
import { AddressItem } from '@/components/AddressItem';
import { InputField } from '@/components/InputField';

const EditAddress = (data: Props) => {
  const { setToken, setUser } = useAuthContext();
  const { tenant, setTenant, setShippingAddress, setShippingPrice } = useAppContext();

  useEffect(()=>{
    setTenant(data.tenant);
    setToken(data.token);
    if(data.user) setUser(data.user);
  }, []);

  
  const [errorFields, setErrorFields] = useState<string[]>([]);

  const [address, setAddress] = useState<Address>(data.address);

  
  const formatter = useFormatter();
  const router = useRouter();
  const api = useApi(data.tenant.slug);

  const changeAddressField = (
    field: keyof Address, 
    value: typeof address[keyof Address]
    ) => { 
        setAddress({...address, [field]: value});    
    }
  
  const verifyAddress = () => {
    let newErrorFields = [];
    let approved = true;

    if(address.cep.replaceAll(/[^0-9]/g, '').length !== 8){
      newErrorFields.push('cep');
      approved = false;
    }
    if(address.street.length <= 2){
      newErrorFields.push('street');
      approved = false;
    }
    if(address.neighborhood.length <= 2){
      newErrorFields.push('neighborhood');
      approved = false;
    }
    if(address.city.length <= 2){
      newErrorFields.push('city');
      approved = false;
    }
    if(address.state.length !== 2){
      newErrorFields.push('state');
      approved = false;
    }

    setErrorFields(newErrorFields);
    return approved;
  }

  const handleSaveAddress = async () => {
    if(verifyAddress()){
        await api.editUserAddress(address);
        router.push(`/${data.tenant.slug}/myaddresses`);
    }
  }

  
  return (
    <div className={styles.container}>
          <Head>
              <title>Editar Endereço | {data.tenant.name}</title>    
          </Head>

          <Header
              backHref={`/${data.tenant.slug}/myaddresses`}
              color={data.tenant.mainColor}  
              title="Editar Endereço"
          />

          <div className={styles.inputs}>

              <div className={styles.row}>
                  <div className={styles.column}>
                      <div className={styles.label}>CEP</div>
                      <InputField 
                          color={data.tenant.mainColor}
                          placeholder='Digite um CEP'
                          value={address.cep}
                          onChange={value => changeAddressField('cep', value)}
                          warning={errorFields.includes('cep')}
                      />  
                  </div>
              </div>

              <div className={styles.row}>
                  <div className={styles.column}>
                      <div className={styles.label}>Rua</div>
                      <InputField 
                          color={data.tenant.mainColor}
                          placeholder='Digite uma rua'
                          value={address.street}
                          onChange={value => changeAddressField('street', value)}
                          warning={errorFields.includes('street')}
                      />  
                  </div>
                  <div className={styles.column}>
                      <div className={styles.label}>Número</div>
                      <InputField 
                          color={data.tenant.mainColor}
                          placeholder='Digite um número'
                          value={address.number}
                          onChange={value => changeAddressField('number', value)}
                          warning={errorFields.includes('number')}
                      />  
                  </div>
              </div>

              <div className={styles.row}>
                  <div className={styles.column}>
                      <div className={styles.label}>Bairro</div>
                      <InputField 
                          color={data.tenant.mainColor}
                          placeholder='Digite um bairro'
                          value={address.neighborhood}
                          onChange={value => changeAddressField('neighborhood', value)}
                          warning={errorFields.includes('neighborhood')}
                      />  
                  </div>
              </div>

              <div className={styles.row}>
                  <div className={styles.column}>
                      <div className={styles.label}>Cidade</div>
                      <InputField 
                          color={data.tenant.mainColor}
                          placeholder='Digite uma cidade'
                          value={address.city}
                          onChange={value => changeAddressField('city', value)}
                          warning={errorFields.includes('city')}
                      />  
                  </div>
              </div>

              <div className={styles.row}>
                  <div className={styles.column}>
                      <div className={styles.label}>Estado</div>
                      <InputField 
                          color={data.tenant.mainColor}
                          placeholder='Digite um estado'
                          value={address.state}
                          onChange={value => changeAddressField('state', value)}
                          warning={errorFields.includes('state')}
                      />  
                  </div>
              </div>

              <div className={styles.row}>
                  <div className={styles.column}>
                      <div className={styles.label}>Complemento</div>
                      <InputField 
                          color={data.tenant.mainColor}
                          placeholder='Digite um complemeto'
                          value={address.complement ?? ''}
                          onChange={value => changeAddressField('complement', value)}
                          warning={errorFields.includes('complement')}
                      />  
                  </div>
              </div>

          </div>
        

        <div className={styles.btnArea}>
            <Button 
                color={data.tenant.mainColor}
                label="Atualizar"
                onClick={handleSaveAddress}
                fill
            />    
        </div>                         

    </div>
  )
}
export default EditAddress;

type Props = {
  tenant: Tenant,
  token: string,
  user: User | null;
  address: Address;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  
  const { tenant: tenantSlug, addressid } = context.query;
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

  //Get Logged User. If doesn´t have cookie set null
  let token = getCookie('token', context);
  if(!token){
    token = null;
  }
  
  const user = await api.authorizeToken(token as string);
  if(!user) {
    return { redirect: { destination: '/login', permanent: false } }
  }

  //Get Address
  const address = await api.getUserAddress(parseInt(addressid as string));

  if(!address){
    return { redirect: { destination: '/myaddresses', permanent: false } }
  }

  return{
    props: {
      tenant,
      user,
      token,
      address
    }
  }

}