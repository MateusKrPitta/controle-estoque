import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
} from "@mui/material";
import AddchartIcon from "@mui/icons-material/Addchart";
import Navbar from "../../components/navbars/header";
import HeaderPerfil from "../../components/navbars/perfil/index.js";
import MenuMobile from "../../components/menu-mobile/index.js";
import ButtonComponent from "../../components/button";
import CentralModal from "../../components/modal-central/index.js";
import SelectTextFields from "../../components/select/index.js";
import TableComponent from "../../components/table/index.js";
import { headerEntradaSaida } from "../../entities/headers/header-entrada-saida.js";
import { formatValor } from "../../utils/functions.js";
import CustomToast from "../../components/toast/index.js";
import Saida from "../../assets/icones/saida.png";
import Desperdicio from "../../assets/icones/desperdicio.png";
import Entradas from "../../assets/icones/entradas.png";
import Valor from "../../assets/icones/valor.png";
import api from "../../services/api.js";
import { useNavigate } from "react-router-dom";
import { useUnidade } from "../../components/unidade-context/index.js";
import TableLoading from "../../components/loading/loading-table/loading.js";
import moment from "moment";
import Logo from "../../assets/png/logo_preta.png";

import {
  AddCircleOutline,
  Save,
  DateRange,
  Print,
  ProductionQuantityLimits,
} from "@mui/icons-material";
import ArticleIcon from "@mui/icons-material/Article";
import ScaleIcon from "@mui/icons-material/Scale";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CategoryIcon from "@mui/icons-material/Category";
import SearchIcon from "@mui/icons-material/Search";

const EntradaSaida = () => {
  const [isDesativa, setDesativa] = useState(false);
  const { unidadeId } = useUnidade();
  const [cadastro, setCadastro] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [entradasSaidas, setEntradasSaidas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState(false);
  const [dataCadastro, setDataCadastro] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [selectedProdutoFiltro, setSelectedProdutoFiltro] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [uniqueCategoriesCount, setUniqueCategoriesCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [observacao, setObservacao] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipos, setSelectedTipos] = useState([]);
  const [produto, setProduto] = useState("");
  const [limparCampos, setLimparCampos] = useState(false);
  const [quantidade, setQuantidade] = useState("");
  const [tipo, setTipo] = useState("entrada");
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [entradasSaidasOriginais, setEntradasSaidasOriginais] = useState([]);

  const filteredEntradasSaidas = entradasSaidas.filter((registro) => {
    return (
      registro.produtoNome &&
      registro.produtoNome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCadastro = () => setCadastro(true);
  const handleCloseCadastro = () => setCadastro(false);

  const handleCloseFiltro = () => setFiltro(false);

  const handleLimparCampos = () => {
    setLimparCampos(!limparCampos);

    if (!limparCampos) {
      setDataInicial("");
      setDataFinal("");
      setSelectedCategoria("");
      setSelectedTipos([]);
      setSelectedProdutoFiltro("");
      setSearchTerm("");

      fetchEntradasSaidas(unidadeId);
      handleCloseFiltro();
    }
  };

  const handleCadastrarRegistro = async () => {
    setDesativa(true);
    const quantidadeNumerica = parseFloat(quantidade) || 0;
    const valorTotal = produtoSelecionado
      ? produtoSelecionado.precoPorcao * quantidadeNumerica
      : 0;

    const dataFormatada = dataCadastro
      ? moment(dataCadastro).format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD");

    const novoRegistro = {
      data: dataFormatada,
      movTipo: tipo === "entrada" ? 1 : tipo === "saida" ? 2 : 3,
      quantidade: quantidadeNumerica,
      produtoId: produtoSelecionado ? produtoSelecionado.id : null,
      observacao: observacao,
    };

    try {
      const response = await api.post("/movimentacao", novoRegistro);

      const updatedEntradasSaidas = [
        ...entradasSaidas,
        { ...novoRegistro, valorTotal },
      ];
      setEntradasSaidas(updatedEntradasSaidas);

      setProduto("");
      setQuantidade("");
      setTipo("entrada");
      setProdutoSelecionado(null);
      setObservacao("");
      setDataCadastro("");
      handleCloseCadastro();

      fetchEntradasSaidas();
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors || "Erro ao cadastrar registro!";
      CustomToast({ type: "error", message: errorMessage });
    } finally {
      setDesativa(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");

    // Calcula totais
    const totalEntradas = filteredEntradasSaidas
      .filter((r) => r.tipo === "entrada")
      .reduce((acc, curr) => acc + (parseFloat(curr.quantidade) || 0), 0);

    const totalSaidas = filteredEntradasSaidas
      .filter((r) => r.tipo === "saida")
      .reduce((acc, curr) => acc + (parseFloat(curr.quantidade) || 0), 0);

    const totalDesperdicio = filteredEntradasSaidas
      .filter((r) => r.tipo === "desperdicio")
      .reduce((acc, curr) => acc + (parseFloat(curr.quantidade) || 0), 0);

    const valorTotalEntradas = filteredEntradasSaidas
      .filter((r) => r.tipo === "entrada")
      .reduce((acc, curr) => {
        const valor = curr.valorTotal
          ? parseFloat(curr.valorTotal.replace(/[^\d,]/g, "").replace(",", "."))
          : 0;
        return acc + (isNaN(valor) ? 0 : valor);
      }, 0);

    const valorTotalSaidas = filteredEntradasSaidas
      .filter((r) => r.tipo === "saida")
      .reduce((acc, curr) => {
        const valor = curr.valorTotal
          ? parseFloat(curr.valorTotal.replace(/[^\d,]/g, "").replace(",", "."))
          : 0;
        return acc + (isNaN(valor) ? 0 : valor);
      }, 0);

    const valorTotalDesperdicio = filteredEntradasSaidas
      .filter((r) => r.tipo === "desperdicio")
      .reduce((acc, curr) => {
        const valor = curr.valorTotal
          ? parseFloat(curr.valorTotal.replace(/[^\d,]/g, "").replace(",", "."))
          : 0;
        return acc + (isNaN(valor) ? 0 : valor);
      }, 0);

    const valorTotalEstoque =
      valorTotalEntradas - valorTotalSaidas - valorTotalDesperdicio;

    // Cards HTML
    const cardsHTML = `
    <div class="cards-container">
      <div class="card">
        <h4>Entradas</h4>
        <p>Quantidade: ${totalEntradas.toFixed(2)}</p>
        <p>Valor: ${formatValor(valorTotalEntradas)}</p>
      </div>
      <div class="card">
        <h4>Saídas</h4>
        <p>Quantidade: ${totalSaidas.toFixed(2)}</p>
        <p>Valor: ${formatValor(valorTotalSaidas)}</p>
      </div>
      <div class="card">
        <h4>Desperdício</h4>
        <p>Quantidade: ${totalDesperdicio.toFixed(2)}</p>
        <p>Valor: ${formatValor(valorTotalDesperdicio)}</p>
      </div>
     
    </div>
  `;

    // Tabela HTML
    const tableRows = filteredEntradasSaidas
      .map(
        (registro) => `
    <tr>
      <td>${
        registro.tipo === "entrada"
          ? "Entrada"
          : registro.tipo === "saida"
          ? "Saída"
          : "Desperdício"
      }</td>
      <td>${registro.produtoNome || ""}</td>
      <td>${registro.quantidade || ""}</td>
      <td>${registro.precoPorcao ? registro.precoPorcao.trim() : ""}</td>
      <td>${registro.valorTotal ? registro.valorTotal.trim() : ""}</td>
      <td>${registro.categoria || ""}</td>
      <td>${registro.observacao || ""}</td>
      <td>${registro.dataFormatada || ""}</td>
    </tr>
  `
      )
      .join("");

    const tableHTML = `
    <html>
      <head>
        <title>Relatório de Entradas/Saídas</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
          }
          .logo-container {
            text-align: center;
            margin-bottom: 20px;
          }
          .logo {
            max-width: 150px;
            height: auto;
          }
          .title {
            text-align: center;
            margin-bottom: 15px;
          }
          .cards-container {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 20px;
            justify-content: center;
          }
          .card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            width: 200px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .card h4 {
            margin-top: 0;
            color: #333;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
          }
          .card p {
            margin: 5px 0;
            font-size: 14px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px;
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
          }
          th { 
            background-color: #f2f2f2; 
          }
          @media print {
            .no-print {
              display: none;
            }
            body {
              margin: 0;
              padding: 10px;
            }
            .card {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="logo-container">
          <img src="${Logo}" alt="Logo" class="logo" />
        </div>
        <h2 class="title">Relatório de Entradas e Saídas</h2>
        
        ${cardsHTML}
        
        <h3 class="title">Detalhes das Movimentações</h3>
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Nome</th>
              <th>Quantidade</th>
              <th>Preço por Porção</th>
              <th>Valor Total</th>
              <th>Categoria</th>
              <th>Observação</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        
        <div class="no-print" style="margin-top: 20px; text-align: center; font-size: 12px; color: #777;">
          Relatório gerado em ${new Date().toLocaleString()}
        </div>
      </body>
    </html>
  `;

    printWindow.document.write(tableHTML);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 1000);
  };

  const valorTotalEntradas = entradasSaidas
    .filter((registro) => registro.tipo === "entrada")
    .reduce((acc, registro) => {
      const valor = parseFloat(
        registro.valorTotal.replace(/[^\d,]/g, "").replace(",", ".")
      );
      return acc + (isNaN(valor) ? 0 : valor);
    }, 0);

  const valorTotalDesperdicio = entradasSaidas
    .filter((registro) => registro.tipo === "desperdicio")
    .reduce((acc, registro) => {
      const valor = parseFloat(
        registro.valorTotal.replace(/[^\d,]/g, "").replace(",", ".")
      );
      return acc + (isNaN(valor) ? 0 : valor);
    }, 0);

  const valorTotalSaidas = entradasSaidas
    .filter((registro) => registro.tipo === "saida")
    .reduce((acc, registro) => {
      const valor = parseFloat(
        registro.valorTotal.replace(/[^\d,]/g, "").replace(",", ".")
      );
      return acc + (isNaN(valor) ? 0 : valor);
    }, 0);

  const valorTotalEstoque =
    valorTotalEntradas - valorTotalSaidas - valorTotalDesperdicio;
  const fetchProdutos = async () => {
    try {
      const response = await api.get(`/produto?unidadeId=${unidadeId}`);
      const produtosFiltrados = response.data.data.filter(
        (produto) => produto.unidadeId === unidadeId
      );

      setProdutos(produtosFiltrados);
    } catch (error) {
      CustomToast({ type: "error", message: "Erro ao carregar produtos!" });
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await api.get(`/categoria?unidade=${unidadeId}`);
      const categoriasFiltradas = response.data.data.filter(
        (categoria) => categoria.unidadeId === unidadeId
      );
      setCategorias(categoriasFiltradas);
    } catch (error) {
      CustomToast({ type: "error", message: "Erro ao carregar categorias!" });
    }
  };

  const fetchEntradasSaidas = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/movimentacao?unidade=${unidadeId}`);
      const movimentacoes = response.data.data;

      // Ordenar por data mais recente primeiro
      const sortedMovimentacoes = [...movimentacoes].sort((a, b) => {
        return new Date(b.data) - new Date(a.data); // Decrescente (mais recente primeiro)
      });

      const formattedMovimentacoes = sortedMovimentacoes.map((mov) => {
        const valorTotal = mov.precoPorcao * mov.quantidade;
        const dataUTC = moment.utc(mov.data);

        return {
          id: mov.id,
          tipo:
            mov.tipo === "1"
              ? "entrada"
              : mov.tipo === "2"
              ? "saida"
              : "desperdicio",
          produtoNome: mov.produtoNome,
          quantidade: mov.quantidade,
          categoria: mov.categoriaNome,
          precoPorcao: ` ${formatValor(mov.precoPorcao)}`,
          valorTotal: ` ${formatValor(valorTotal)}`,
          observacao: mov.observacao,
          dataISO: mov.data,
          dataFormatada: dataUTC.format("DD/MM/YYYY"),
        };
      });

      setEntradasSaidas(formattedMovimentacoes);
      setEntradasSaidasOriginais(formattedMovimentacoes);
    } catch (error) {
      CustomToast({
        type: "error",
        message: "Erro ao carregar as movimentações!",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const categoriasSalvas =
      JSON.parse(localStorage.getItem("categorias")) || [];
    const categoriasUnicas = Array.from(
      new Set(categoriasSalvas.map((cat) => cat.nome))
    ).map((nome) => categoriasSalvas.find((cat) => cat.nome === nome));

    setCategorias(categoriasUnicas);
    setUniqueCategoriesCount(categoriasUnicas.length);
    fetchProdutos();
  }, []);

  const handlePesquisar = () => {
    const filteredData = entradasSaidasOriginais
      .filter((registro) => {
        const matchesProduto = selectedProdutoFiltro
          ? registro.produtoNome &&
            registro.produtoNome
              .toLowerCase()
              .includes(selectedProdutoFiltro.toLowerCase())
          : true;

        const matchesSearchTerm = searchTerm
          ? registro.produtoNome &&
            registro.produtoNome
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          : true;

        const dataInicialMoment = dataInicial
          ? moment.utc(dataInicial).startOf("day")
          : null;
        const dataFinalMoment = dataFinal
          ? moment.utc(dataFinal).endOf("day")
          : null;
        const registroDataMoment = moment.utc(registro.dataISO);

        const matchesDataInicial = dataInicialMoment
          ? registroDataMoment.isSameOrAfter(dataInicialMoment)
          : true;
        const matchesDataFinal = dataFinalMoment
          ? registroDataMoment.isSameOrBefore(dataFinalMoment)
          : true;

        const matchesCategoria = selectedCategoria
          ? registro.categoria === selectedCategoria
          : true;

        const matchesTipo =
          selectedTipos.length > 0
            ? selectedTipos.includes(registro.tipo)
            : true;

        return (
          matchesProduto &&
          matchesSearchTerm &&
          matchesDataInicial &&
          matchesDataFinal &&
          matchesCategoria &&
          matchesTipo
        );
      })
      .sort((a, b) => {
        return new Date(b.dataISO) - new Date(a.dataISO); // Ordenar por data decrescente
      });

    setEntradasSaidas(filteredData);
    handleCloseFiltro();
  };

  const handleDeleteMovimentacao = async (id) => {
    try {
      await api.delete(`/movimentacao/${id}`);
      CustomToast({
        type: "success",
        message: "Movimentação deletada com sucesso!",
      });
      fetchEntradasSaidas();
    } catch (error) {
      let errorMessage = "Erro ao deletar movimentação!";

      if (error.response && error.response.data && error.response.data.errors) {
        errorMessage = error.response.data.errors;
      } else if (error.message) {
        errorMessage = error.message;
      }

      CustomToast({
        type: "error",
        message: errorMessage,
      });
    }
  };

  useEffect(() => {
    if (unidadeId) {
      fetchProdutos();
      fetchCategorias();
    }
  }, [unidadeId]);

  useEffect(() => {
    if (unidadeId) {
      fetchCategorias();
      fetchEntradasSaidas();
    }
  }, [unidadeId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="flex w-full ">
      <Navbar />
      <div className="flex ml-0 flex-col gap-3 w-full items-end sm:m-0 lg:ml-2">
        <MenuMobile />
        <HeaderPerfil />
        <h1 className="justify-center  md:justify-center lg:justify-start items-center md:text-2xl font-bold text-black w-[99%] flex  gap-2 ">
          <AddchartIcon /> Entrada e Saída
        </h1>
        <div
          className={`w-[99%] justify-center flex-wrap mt-4 mb-4 flex items-center gap-4 transition-opacity duration-500 ${
            isVisible ? "opacity-100" : "opacity-0 translate-y-4"
          }`}
        >
          <div
            className="w-[80%] md:w-[23%] lg:w-[20%] p-2 bg-primary flex flex-col gap-3 justify-center items-center"
            style={{ border: "1px solid black", borderRadius: "10px" }}
          >
            <label className="text-xs font-bold">Entradas</label>
            <div className="flex items-center justify-center gap-5">
              <img src={Entradas} alt="Entradas" />
              <label>{formatValor(valorTotalEntradas)}</label>
            </div>
          </div>

          <div
            className="w-[80%] md:w-[23%] lg:w-[20%] p-2 bg-primary flex flex-col gap-3 justify-center items-center"
            style={{ border: "1px solid black", borderRadius: "10px" }}
          >
            <label className="text-xs font-bold">Saídas</label>
            <div className="flex items-center justify-center gap-5">
              <img src={Saida} alt="Saídas" />
              <label>{formatValor(valorTotalSaidas)}</label>
            </div>
          </div>
          <div
            className="w-[80%] md:w-[23%] lg:w-[20%] p-2 bg-primary flex flex-col gap-3 justify-center items-center"
            style={{ border: "1px solid black", borderRadius: "10px" }}
          >
            <label className="text-xs font-bold">Desperdício</label>
            <div className="flex items-center justify-center gap-5">
              <img src={Desperdicio} alt="Desperdício" />
              <label>{formatValor(valorTotalDesperdicio)}</label>
            </div>
          </div>

          <div
            className="w-[80%] md:w-[23%] lg:w-[20%] p-2 bg-primary flex flex-col gap-3 justify-center items-center"
            style={{ border: "1px solid black", borderRadius: "10px" }}
          >
            <label className="text-xs font-bold">Valor total em estoque</label>
            <div className="flex items-center justify-center gap-5">
              <img src={Valor} alt="Valor Total em Estoque" />
              <label>{formatValor(valorTotalEstoque)}</label>
            </div>
          </div>
        </div>
        <div
          className={`ml-0 flex flex-col w-[98%] md:ml-0 lg:ml-2 mr-3 transition-opacity duration-500 ${
            isVisible ? "opacity-100" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex gap-2 justify-center flex-wrap md:justify-start items-center md:items-start">
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Pesquisar por nome"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              sx={{ width: { xs: "60%", sm: "50%", md: "40%", lg: "40%" } }}
            />

            <ButtonComponent
              startIcon={<AddCircleOutline fontSize="small" />}
              title={"Cadastrar"}
              subtitle={"Cadastrar"}
              buttonSize="large"
              onClick={handleCadastro}
            />
            <IconButton
              title="Filtro"
              onClick={() => setFiltro(true)}
              className="view-button w-10 h-10 "
              sx={{
                color: "black",
                border: "1px solid black",
                "&:hover": {
                  color: "#fff",
                  backgroundColor: "#BCDA72",
                  border: "1px solid black",
                },
              }}
            >
              <FilterAltIcon fontSize={"small"} />
            </IconButton>
            <IconButton
              title="Imprimir"
              onClick={handlePrint}
              className="view-button w-10 h-10 "
              sx={{
                color: "black",
                border: "1px solid black",
                "&:hover": {
                  color: "#fff",
                  backgroundColor: "#BCDA72",
                  border: "1px solid black",
                },
              }}
            >
              <Print fontSize={"small"} />
            </IconButton>
          </div>
          <div className="w-[100%]">
            {loading ? (
              <div className="flex w-full flex-col items-center justify-center gap-5 h-96">
                <TableLoading />
                <label className="text-sm">Carregando...</label>
              </div>
            ) : filteredEntradasSaidas.length === 0 ? (
              <div className="flex w-full flex-col items-center justify-center gap-5 h-96">
                <TableLoading />
                <label className="text-sm">Nenhum resultado encontrado!</label>
              </div>
            ) : (
              <TableComponent
                headers={headerEntradaSaida}
                rows={filteredEntradasSaidas}
                actionsLabel={"Ações"}
                actionCalls={{
                  delete: (row) => handleDeleteMovimentacao(row.id),
                }}
              />
            )}
          </div>
        </div>
        <CentralModal
          tamanhoTitulo={"81%"}
          maxHeight={"90vh"}
          top={"28%"}
          left={"28%"}
          width={"400px"}
          icon={<AddCircleOutline fontSize="small" />}
          open={cadastro}
          onClose={handleCloseCadastro}
          title="Cadastrar Entrada/Saída"
        >
          <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
            <div className="mt-4 flex gap-3 flex-wrap">
              <Autocomplete
                options={produtos}
                getOptionLabel={(option) => {
                  const preco = option.valorPorcao || option.precoPorcao || 0;
                  return `${option.nome} - ${formatValor(preco)}`;
                }}
                value={produtoSelecionado}
                noOptionsText="Nenhum produto encontrado"
                onChange={(event, newValue) => {
                  setProdutoSelecionado(newValue);
                  setProduto(newValue ? newValue.nome : "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Produto"
                    variant="outlined"
                    size="small"
                    sx={{
                      width: "200px",
                    }}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <ArticleIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Quantidade"
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                autoComplete="off"
                sx={{ width: { xs: "45%", sm: "50%", md: "40%", lg: "35%" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ScaleIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Observação"
                value={observacao}
                sx={{ width: { xs: "45%", sm: "93%", md: "40%", lg: "96%" } }}
                onChange={(e) => setObservacao(e.target.value)}
                autoComplete="off"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ArticleIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <SelectTextFields
                width={"150px"}
                icon={<AddchartIcon fontSize="small" />}
                label={"Tipo"}
                backgroundColor={"#D9D9D9"}
                name={"tipo"}
                fontWeight={500}
                options={[
                  { value: "entrada", label: "Entrada" },
                  { value: "saida", label: "Saída" },
                  { value: "desperdicio", label: "Desperdício" },
                ]}
                onChange={(e) => setTipo(e.target.value)}
              />
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Data"
                value={dataCadastro}
                type="date"
                onChange={(e) => setDataCadastro(e.target.value)}
                autoComplete="off"
                sx={{ width: { xs: "50%", sm: "50%", md: "40%", lg: "49%" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DateRange />
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <div className="w-[95%] mt-2 flex items-end justify-end">
              <ButtonComponent
                title={"Cadastrar"}
                subtitle={"Cadastrar"}
                startIcon={<Save />}
                disabled={isDesativa}
                onClick={handleCadastrarRegistro}
              />
            </div>
          </div>
        </CentralModal>

        <CentralModal
          tamanhoTitulo={"81%"}
          maxHeight={"100vh"}
          top={"20%"}
          left={"28%"}
          width={"400px"}
          icon={<FilterAltIcon fontSize="small" />}
          open={filtro}
          onClose={handleCloseFiltro}
          title="Filtro"
        >
          <div>
            <div className="mt-4 flex gap-3 flex-wrap">
              <Autocomplete
                options={produtos}
                getOptionLabel={(option) => {
                  const preco = option.valorPorcao || option.precoPorcao || 0;
                  return `${option.nome} - ${formatValor(preco)}`;
                }}
                value={
                  produtos.find((p) => p.nome === selectedProdutoFiltro) || null
                }
                noOptionsText="Nenhum produto encontrado"
                onChange={(event, newValue) => {
                  setSelectedProdutoFiltro(newValue ? newValue.nome : "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Produto"
                    variant="outlined"
                    size="small"
                    sx={{ width: "320px" }}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <ProductionQuantityLimits fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Data Inicial"
                value={dataInicial}
                type="date"
                onChange={(e) => setDataInicial(e.target.value)}
                autoComplete="off"
                sx={{ width: { xs: "50%", sm: "50%", md: "40%", lg: "49%" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DateRange />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Data Final"
                type="date"
                value={dataFinal}
                onChange={(e) => setDataFinal(e.target.value)}
                autoComplete="off"
                sx={{ width: { xs: "42%", sm: "43%", md: "40%", lg: "43%" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DateRange />
                    </InputAdornment>
                  ),
                }}
              />
              <SelectTextFields
                width={"170px"}
                icon={<CategoryIcon fontSize="small" />}
                label={"Categorias"}
                backgroundColor={"#D9D9D9"}
                name={"categoria"}
                fontWeight={500}
                options={categorias.map((categoria) => ({
                  label: categoria.nome,
                  value: categoria.nome,
                }))}
                onChange={(e) => setSelectedCategoria(e.target.value)}
                value={selectedCategoria}
              />
              <SelectTextFields
                width={"155px"}
                icon={<AddchartIcon fontSize="small" />}
                label={"Tipo"}
                backgroundColor={"#D9D9D9"}
                name={"tipo"}
                fontWeight={500}
                options={[
                  { value: "entrada", label: "Entrada" },
                  { value: "saida", label: "Saída" },
                  { value: "desperdicio", label: "Desperdício" },
                ]}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedTipos(value);
                }}
                value={selectedTipos}
                multiple
              />
              <FormControlLabel
                control={
                  <Switch
                    style={{ marginLeft: "5px" }}
                    size="small"
                    checked={limparCampos}
                    onChange={handleLimparCampos}
                    color="primary"
                  />
                }
                label="Limpar Filtro"
              />
            </div>
            <div className="w-[95%] mt-2 flex items-end justify-end">
              <ButtonComponent
                title={"Pesquisar"}
                subtitle={"Pesquisar"}
                startIcon={<SearchIcon />}
                onClick={handlePesquisar}
              />
            </div>
          </div>
        </CentralModal>
      </div>
    </div>
  );
};

export default EntradaSaida;
