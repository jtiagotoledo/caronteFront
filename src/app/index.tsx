import { View, Text, TouchableHighlight, TextInput } from 'react-native';
import { useState } from 'react';
import obterCotacao from '../services/brapiService'

export default function HomeScreen() {

  const [ticker, setTicker] = useState('');
  const [naoExisteTicker, setNaoExisteTicker] = useState(false);

  const pegarCotacao = async (ticker:string) => {
    setNaoExisteTicker(false)
    const dados = await obterCotacao(ticker);
    if(!dados) setNaoExisteTicker(true);
    console.log('dados', dados);
  }

  return (
    <View className="flex-1 items-center justify-center bg-zinc-100">
      <Text className="text-xl font-bold text-cyan-500">
        Caronte Invest! 
      </Text>
      <TextInput
        className='border mt-4 text-center'
        placeholder='Digite o tiker aqui'
        onChangeText={(text)=>setTicker(text)}
      />
      <TouchableHighlight onPress={()=>pegarCotacao(ticker)}>
        <Text className='bg-zinc-400 rounded-md p-2 text-zinc-100 mt-4'>
          Pegar Cotação 
        </Text>
      </TouchableHighlight>
      {naoExisteTicker && 
        <Text className='text-cyan-500 mt-4'>Ativo não existe</Text>
      }
    </View>
  );
}


