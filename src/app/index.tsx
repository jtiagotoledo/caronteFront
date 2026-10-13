import { View, Text, TouchableWithoutFeedback, FlatList, Pressable, Alert, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { iniciarBanco, buscarOperacoes, deletarOperacao, buscarTotalInvestido, TotalInvestido, Operacao } from '@/db/database';
import { buscarCotacao } from '../services/api'
import iconeFallback from '@/assets/images/caronte_invest_claro.png';
import { ModalResumo } from '@/components/ModalResumo';

export default function HomeScreen() {

  interface CotacaoInfo {
    cotacaoAtual: number;
    variacao: number;
    variacaoPercentual: number;
  }
  interface LogoAtivoProps {
    ticker: string;
    tamanho?: number;
  }

  interface itemOperacao {
    id: number;
    ticker: string;
    nome: string;
    qnt_papeis: number;
    data_compra: string;
    valor_compra: number;
    data_venda: string | null;
    valor_venda: number | null;
    cotacaoAtual: number;
    variacao: number;
    variacaoPercentual: number;
  }

  function LogoAtivo({ ticker, tamanho = 40 }: LogoAtivoProps) {
    const tickerLimpo = ticker.replace(/[0-9.].*$/, '');
    const urlLogoOriginal = `https://caronte.solardev.dpdns.org/api/logos/${tickerLimpo}.png`;

    const [fonteImagem, setFonteImagem] = useState<any>(urlLogoOriginal);

    return (
      <Image
        source={fonteImagem}
        style={{ width: tamanho, height: tamanho }}
        contentFit="contain"
        onError={() => setFonteImagem(iconeFallback)}
      />
    );
  }

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [cotacoes, setCotacoes] = useState<Record<string, CotacaoInfo>>({});
  const [_, setNaoExisteTicker] = useState(false);
  const [operacoes, setOperacoes] = useState<Operacao[]>([]);
  const [totalInvestido, setTotalInvestido] = useState<number>(0);
  const [modalVisivel, setModalVisivel] = useState<boolean>(false);
  const [itemCompleto, setItemCompleto] = useState<itemOperacao | null>(null);

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
            cotacaoAtual: cotacao.preco,
            variacao: Math.round(cotacao.variacao * 100) / 100,
            variacaoPercentual: Math.round(cotacao.variacaoPercentual * 100) / 100,
          }
        }
      }
      setCotacoes(cotacoes);
    }
    carregarDados();
  }, []);

  const handleExcluirDoModal = (id: number) => {
    Alert.alert(
      "Excluir Operação",
      "Tem certeza que deseja excluir esta operação?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            const deleteOk = deletarOperacao(id);
            if (deleteOk) {
              setModalVisivel(false);
              const operacoes = buscarOperacoes();
              setOperacoes(operacoes);
              const total = buscarTotalInvestido();
              setTotalInvestido(total);
              Alert.alert('Sucesso', 'Operação deletada com sucesso.');
            } else {
              Alert.alert('Erro', 'Não foi possível excluir a operação.');
            }
          }
        }
      ]
    );
  };

  const handleEditarDoModal = (item: any) => {
    setModalVisivel(false);
    // Exemplo: navegar para a tela de edição passando o id ou dados
    // router.push({ pathname: './add', params: { id: item.id } });
  };

  const handleFecharPosicaoDoModal = (item: any) => {
    setModalVisivel(false);
    // Aqui você implementa a lógica para registrar a venda (atualizar data_venda e valor_venda no banco)
    Alert.alert('Aviso', 'Funcionalidade de fechar posição em breve.');
  };

  const pegarCotacao = async (ticker: string) => {
    setNaoExisteTicker(false)
    const dados = await buscarCotacao(ticker);

    if (!dados) {
      setNaoExisteTicker(true);
      return null;
    }
    return dados;
  }

  const handleAbrirModal = (item: Operacao) => {
    const cotacao = cotacoes[item.ticker];
    const itemJuncao: itemOperacao = {
      ...item,
      cotacaoAtual: cotacao?.cotacaoAtual ?? 0,
      variacao: cotacao?.variacao ?? 0,
      variacaoPercentual: cotacao?.variacaoPercentual ?? 0,
    };

    console.log(itemJuncao);
    setItemCompleto(itemJuncao);
    setModalVisivel(true);

  }

  const rendeItemOperacao = (item: Operacao, cotacoes: any) => {
    const cotacao = cotacoes[item.ticker];
    const cotacaoAtual = cotacao?.cotacaoAtual ?? 0;
    const variacao = cotacao?.variacao ?? 0;
    const variacaoPercentual = cotacao?.variacaoPercentual ?? 0;

    return (
      <Pressable
        className='flex-row bg-white h-28 w-full px-4 mb-2 rounded-xl justify-between border border-zinc-200'
        onPress={() => handleAbrirModal(item)}
      >
        <View className='flex-row items-center'>
          <View className="mr-4 w-10 h-10 items-center justify-center overflow-hidden">
            <LogoAtivo ticker={item.ticker} tamanho={40} />
          </View>

          <View>
            <Text className='text-amber-600 text-2xl'>{item.ticker}</Text>
            <Text className='text-zinc-400 text-sm'>Compra {item.qnt_papeis}  |  {item.valor_compra}</Text>
          </View>
        </View>
        <View className='items-end justify-center'>
          <Text className='text-amber-600 text-2xl'>{cotacaoAtual}</Text>
          <Text className={`text-sm ${variacao >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            R$ {variacao}   {variacaoPercentual}%
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

      <ModalResumo
        visible={modalVisivel}
        onClose={() => { setModalVisivel(false) }}
        item={itemCompleto}
        onExcluir={handleExcluirDoModal}
        onEditar={handleEditarDoModal}
        onFecharPosicao={handleFecharPosicaoDoModal}
      />
    </View>
  );
}