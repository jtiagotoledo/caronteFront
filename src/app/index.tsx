import { View, Text, TouchableHighlight, TextInput, TouchableWithoutFeedback } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { iniciarBanco, buscarOperacoes } from '@/db/database';
import obterCotacao from '../services/brapiService'

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [ticker, setTicker] = useState('');
  const [_, setNaoExisteTicker] = useState(false);

  useEffect(() => {
    iniciarBanco();
    carregarDados();
  }, []);

  const carregarDados = () => {
    const ativos = buscarOperacoes();
    console.log('listaDeAtivos', ativos);
  }

  const pegarCotacao = async (ticker: string) => {
    setNaoExisteTicker(false)
    const dados = await obterCotacao(ticker);
    if (!dados) setNaoExisteTicker(true);
    console.log('dados', dados);
  }

  return (
    <View className='flex-1'>

      {/* toolbar */}
      <View style={{ paddingTop: insets.top }} className='flex-row items-center justify-between h-28 bg-cyan-500 px-4'>
        
        <View className='flex-row items-center'>
          <Ionicons name='menu' size={24} color='white' />
        </View>

        <View className='flex-row items-center '>
          <Text className='text-white text-2xl'>Caronte Invest</Text>
        </View>

        <TouchableWithoutFeedback
          className='flex-row items-center'
          onPress={()=>router.replace('./add')}
        >
          <Ionicons name='add-circle' size={24} color='white' />
        </TouchableWithoutFeedback>

      </View>

      {/* componente */}
      <View className="flex-1 items-center justify-center bg-zinc-100">
        
        <TextInput
          className='border mt-4 text-center w-48'
          placeholder='Digite o tiker aqui'
          onChangeText={(text) => setTicker(text)}
        />
        <TouchableHighlight onPress={() => pegarCotacao(ticker)}>
          <Text className='bg-zinc-400 rounded-md p-2 text-zinc-100 mt-4'>
            Pegar Cotação
          </Text>
        </TouchableHighlight>
      </View>

    </View>
  );
}


