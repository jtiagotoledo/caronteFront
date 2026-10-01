import { View, Text, TouchableWithoutFeedback, FlatList, Pressable, Alert, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { iniciarBanco, buscarOperacoes, deletarOperacao, buscarTotalInvestido, TotalInvestido, Operacao } from '@/db/database';
import { obterInfoTicker } from '../services/brapiService'

export default function HomeScreen() {

  interface CotacaoInfo {
    cotacaoAtual: number;
    variacao: number;
    variacaoPercent: number;
  }

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [cotacoes, setCotacoes] = useState<Record<string, CotacaoInfo>>({});
  const [_, setNaoExisteTicker] = useState(false);
  const [operacoes, setOperacoes] = useState<Operacao[]>([]);
  const [totalInvestido, setTotalInvestido] = useState<number>(0);
  const [modalVisivel, setModalVisivel] = useState<boolean>(false);

  useEffect(() => {
    async function carregarDados() {
      iniciarBanco();
      const operacoes = buscarOperacoes();
      setOperacoes(operacoes);
      const total = buscarTotalInvestido();

      setTotalInvestido(total);

      let cotacoes: Record<string, CotacaoInfo> = {}
      for (const op of operacoes) {
        const cotacao = await pegarCotacao(op.ticker);
        if (cotacao) {
          cotacoes[op.ticker] = {
            cotacaoAtual: cotacao.data.regularMarketPrice,
            variacao: cotacao.data.regularMarketChange,
            variacaoPercent: cotacao.data.regularMarketChangePercent,
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
    const dados = await obterInfoTicker(ticker);
    console.log('dados', dados);

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
      cotacaoAtual: cotacao?.cotacaoAtual,
      variacao: cotacao?.variacao,
      variacaoPercent: cotacao?.variacaoPercent,
    }
    console.log('itemCompleto', itemCompleto);


    return (
      <Pressable
        className='flex-row bg-white h-28 w-full px-4 mb-2 rounded-xl justify-between border border-zinc-200'
        onLongPress={() => onLongPressOperacao(itemCompleto.id)}
        onPress={() => setModalVisivel(true)}
      >
        <View className='flex-row items-center'>
          <View className="mr-4 w-10 h-10 items-center justify-center overflow-hidden">
            <Image
              source={itemCompleto.logo_url}
              style={{ width: 40, height: 40 }}
              contentFit="contain"
              transition={200}
            />
          </View>

          <View>
            <Text className='text-amber-600 text-2xl'>{itemCompleto.ticker}</Text>
            <Text className='text-zinc-400 text-sm'>Compra {itemCompleto.qnt_papeis}  |  {itemCompleto.valor_compra}</Text>
          </View>
        </View>
        <View className='items-end justify-center'>
          <Text className='text-amber-600 text-2xl'>{itemCompleto.cotacaoAtual}</Text>
          <Text className={`text-sm ${itemCompleto.variacao >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            R$ {itemCompleto.variacao}   {itemCompleto.variacaoPercent}%
          </Text>
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
      <View className='bg-zinc-200 h-20 w-full p-4 '>
        <Text>Total Investido : R$ {totalInvestido.toString().replace('.', ',')}</Text>
      </View>
      <FlatList
        data={operacoes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
        renderItem={({ item }) => rendeItemOperacao(item, cotacoes)}
      />
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => { setModalVisivel(false) }}
      >
        <View className='flex-1 justify-center bg-black/50 px-4'>
          <View className='bg-white w-full max-w-sm p-6 rounded-2xl shadow-xl '>
            <Text className='text-xl m-6'>
              Resumo da operação
            </Text>
            <Pressable onPress={()=>setModalVisivel(false)}>
              <Text>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </View>
  );
}


