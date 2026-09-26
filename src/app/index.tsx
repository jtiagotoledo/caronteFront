import { View, Text, TouchableWithoutFeedback, FlatList, Pressable, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { iniciarBanco, buscarOperacoes, deletarOperacao, Operacao } from '@/db/database';
import obterCotacao from '../services/brapiService'

export default function HomeScreen() {

  interface CotacaoInfo {
    logourl: string;
    longName: string;
  }

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [cotacoes, setCotacoes] = useState<Record<string, CotacaoInfo>>({});
  const [_, setNaoExisteTicker] = useState(false);
  const [operacoes, setOperacoes] = useState<Operacao[]>([]);

  useEffect(() => {
    async function carregarDados() {
      iniciarBanco();
      const operacoes = buscarOperacoes();
      setOperacoes(operacoes);
      console.log('operacoes', operacoes);

      let cotacoes: Record<string, CotacaoInfo> = {}
      for (const op of operacoes) {
        const cotacao = await pegarCotacao(op.ticker);
        if (cotacao) {
          cotacoes[op.ticker] = {
            logourl: cotacao.data.logourl,
            longName: cotacao.data.longName,
          }
        }
      }
      setCotacoes(cotacoes);
    }
    carregarDados();
  }, []);

  const onLongPressOperacao = (id: number) => {
    const deleteOk = deletarOperacao(id);
    if (deleteOk) {
      Alert.alert('Operação deletada com sucesso.');
    } else {
      Alert.alert('Não foi possível excluir a operação.');
    }
  }

  const pegarCotacao = async (ticker: string) => {
    setNaoExisteTicker(false)
    const dados = await obterCotacao(ticker);
    if (!dados) {
      setNaoExisteTicker(true);
      return null;
    }
    return dados;
  }

  const rendeItemOperacao = (item: Operacao, cotacoes: any) => {
    const cotacao = cotacoes[item.ticker];
    const itemCompleto = {
      ...item,
      logourl: cotacao?.logourl,
      longName: cotacao?.longName,
    }
    console.log('itemCompleto', itemCompleto);


    return (
      <Pressable
        className='bg-white h-28 w-full px-4 mb-3 rounded-xl justify-center border border-zinc-200'
        onLongPress={() => onLongPressOperacao(itemCompleto.id)}
      >
        <View className='flex-row items-center'>
          <View className="mr-4 w-10 h-10 items-center justify-center overflow-hidden">
            <Image
              source={itemCompleto.logourl}
              style={{ width: 40, height: 40 }}
              contentFit="contain" 
              transition={200}
            />
          </View>

          <View>
            <Text className='text-amber-600 text-2xl'>{itemCompleto.ticker}</Text>
            <Text className='text-zinc-400 text-sm'>Compra {itemCompleto.qnt_papeis} | {itemCompleto.valor_compra}</Text>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <View className='flex-1 bg-zinc-100'>

      {/* toolbar */}
      <View style={{ paddingTop: insets.top }} className='flex-row items-center justify-between h-28 bg-slate-900 px-4'>

        <View className='flex-row items-center'>
          <Ionicons name='menu' size={24} color='white' />
        </View>

        <View className='flex-row items-center '>
          <Text className='text-amber-600 text-2xl'>Caronte Invest</Text>
        </View>

        <TouchableWithoutFeedback
          className='flex-row items-center'
          onPress={() => router.replace('./add')}
        >
          <Ionicons name='add-circle' size={24} color='white' />
        </TouchableWithoutFeedback>

      </View>

      {/* componente */}
      <FlatList
        data={operacoes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
        renderItem={({ item }) => rendeItemOperacao(item, cotacoes)}
      />

      {/* <View className="flex-1 items-center justify-center bg-zinc-100">
        
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
      </View> */}
    </View>
  );
}


