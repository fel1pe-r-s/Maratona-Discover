//subistituido  por toggle
const Modal = { 

    OpenClose() {
        let NewTransaction = document
        .querySelector(".modal-overlay");
        NewTransaction.classList.toggle("active");
    }
      
} 
//storang
const storang = {
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transactions){
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

// transaçoes

//calculo matematico
const Transaction = {
        all: storang.get(),
/*     all: [
        {    
            description: 'luz',
            amount: -50000,
            date: '23/01/2021',
        },
        {
            description: 'website',
            amount: 500000,
            date: '23/01/2021',
        },
        {
            description: 'internet',
            amount: -50000,
            date: '23/01/2021',
        },
    
        {
            description: 'app',
            amount: 20000,
            date: '23/01/2021',
        }
    ], */

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },
    //removendo
    remove(index){
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes(){
        let income = 0;
        // pegar todas as transacoes 
        // para cada transacao 
        Transaction.all.forEach(transaction => {
            //se ela e maior q zero
            if(transaction.amount > 0){
                // soma a uma variavel e retorna a variavel
                income += transaction.amount;
                
            }
        })
        // para cada transacao 
        
        //soma as entradas
        return income;
    },
    exprenses(){
        let expense = 0;
        // pegar todas as transacoes 
        // para cada transacao 
        Transaction.all.forEach(transaction => {
            //se ela e menor q zero
            if(transaction.amount < 0){
                // soma a uma variavel e retorna a variavel
                expense += transaction.amount;
                
            }
        })
        
        
        //soma as saídas
        return expense
    },
    total(){
        
        // entradas - saídas
        return Transaction.incomes() + Transaction.exprenses();
    }
}

const Dom = {
    //inserindo a table no HTML tbody
    transactionsContainer: document.querySelector('#data-table tbody'),
    
    addTransaction(transaction, index){
        // criando tr da table
        const tr = document.createElement('tr')
        //tr recebemndo html
        tr.innerHTML = Dom.innerHTMLTransaction(transaction , index)
        tr.dataset.index = index
        
        Dom.transactionsContainer.appendChild(tr)
    },
    //Dados da table
    innerHTMLTransaction(transaction, index){
        // aterração de class
        const CSSclass = transaction.amount > 0 ? 'income': 'expense'   

        //formataçao de moeda
        const amount = Utils.formatCurrency(transaction.amount)

        //html inserido no tr
        const html = `        
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
            <td><img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="remover transação"></td>
        
        `
        
        return html
    },
    // //formataçao de moeda dados da tabela
    updateBalance(){
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils
            .formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils
            .formatCurrency(Transaction.exprenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils
            .formatCurrency(Transaction.total())
        
    },

    ClearTransaction(){
        Dom.transactionsContainer.innerHTML = ""
    }
}

//formataçao de moeda
const Utils = {
    formatAmount(value) {
        value= Number(value)*100
            
        return Math.round(value)
    },
    
    formatDate(date) {
        
        const splitteDate = date.split("-")
        
        return `${splitteDate[2]}/${splitteDate[1]}/${splitteDate[0]}`

    },
    formatCurrency(value) {
        //sinal  ngativo
        const signal = Number(value)< 0 ? '-' : ''

        //formataçao para colocar pontos e virgulas
        value = String(value).replace(/\D/g, "")
        value = Number(value)/100

        // Formatação para moeda
        value = value.toLocaleString("pt-BR",{
            style: "currency",
            currency:"BRL"
        })

        return(signal + value)
    }
}

const Form = {
    //propiedade
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),
    
     //pega os valores da estrutura
     getValues(){
        return{
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
     },
    // verifica se todas as informações foram preenchidas
    validateFilds(){
        const {description , amount, date} = Form.getValues()
        console.log(Form.getValues())
        // error casso nao preencha todos os campos  
        if(description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === ""){
                throw new Error("preenchida todos os campos")
        }
    },
    // formata os dados para salvar 
    formatvalues(){
        let { description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return{
            description,
            amount,
            date,
        }
    },
   
    clearFilds(){
        Form.description.value=""
        Form.amount.value=""
        Form.date.value=""
    },
    submit(event){
       event.preventDefault()

        try {
           Form.validateFilds()
           const transaction = Form.formatvalues()
            // salvar
            Transaction.add(transaction)
            //apagar os dados do formulario
            Form.clearFilds()
            //modal feche
            Modal. OpenClose() 
            
        }catch(error){
            alert(error.message);
        }

      

      
      
    }
}

const App = {
    init(){
        // impreção do transactions
        Transaction.all.forEach(function(transaction){
            Dom.addTransaction(transaction)
        })

        Dom.updateBalance()

        storang.set(Transaction.all)

    },
    reload(){
        Dom.ClearTransaction()
        App.init()
    },
}

App.init()
