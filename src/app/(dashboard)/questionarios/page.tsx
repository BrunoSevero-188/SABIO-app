'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup'
import { Label } from '@/components/ui/Label'
import { Separator } from '@/components/ui/Separator'
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  Trophy,
  Brain,
  Clock,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface Quiz {
  id: string
  title: string
  description: string
  icon: string
  color: string
  questions: QuizQuestion[]
  timeLimit?: number // in minutes
}

const quizzes: Quiz[] = [
  {
    id: 'javascript-basics',
    title: 'JavaScript Básico',
    description: 'Teste seus conhecimentos fundamentais de JavaScript',
    icon: '🟨',
    color: 'from-yellow-500 to-orange-500',
    timeLimit: 10,
    questions: [
      {
        id: '1',
        question: 'Qual palavra-chave é usada para declarar uma variável constante em JavaScript?',
        options: ['var', 'let', 'const', 'constant'],
        correctAnswer: 2,
        explanation: 'A palavra-chave `const` declara uma variável cujo valor não pode ser reatribuído.',
      },
      {
        id: '2',
        question: 'Qual método converte uma string JSON em um objeto JavaScript?',
        options: ['JSON.parse()', 'JSON.stringify()', 'JSON.convert()', 'JSON.toObject()'],
        correctAnswer: 0,
        explanation: '`JSON.parse()` analisa uma string JSON e retorna o objeto JavaScript correspondente.',
      },
      {
        id: '3',
        question: 'O que o operador `===` faz em JavaScript?',
        options: [
          'Atribui valor',
          'Compara valor e tipo',
          'Compara apenas valor',
          'Concatena strings',
        ],
        correctAnswer: 1,
        explanation: 'O operador de igualdade estrita (`===`) compara tanto o valor quanto o tipo.',
      },
      {
        id: '4',
        question: 'Qual das seguintes é uma arrow function válida?',
        options: [
          'function() => {}',
          '() => {}',
          '=> function() {}',
          'function => {}',
        ],
        correctAnswer: 1,
        explanation: 'Arrow functions usam a sintaxe `() => {}` para funções anônimas.',
      },
      {
        id: '5',
        question: 'Como acessar o último elemento de um array `arr`?',
        options: ['arr[arr.length]', 'arr[arr.length - 1]', 'arr.last()', 'arr[-1]'],
        correctAnswer: 1,
        explanation: 'Arrays são indexados baseados em zero, então o último índice é `length - 1`.',
      },
    ],
  },
  {
    id: 'react-fundamentals',
    title: 'React Fundamentos',
    description: 'Conceitos essenciais do React para desenvolvedores',
    icon: '⚛️',
    color: 'from-blue-500 to-cyan-500',
    timeLimit: 15,
    questions: [
      {
        id: '1',
        question: 'Qual hook é usado para gerenciar estado em componentes funcionais?',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctAnswer: 1,
        explanation: '`useState` é o hook básico para adicionar estado a componentes funcionais.',
      },
      {
        id: '2',
        question: 'O que o `useEffect` com array vazio `[]` faz?',
        options: [
          'Roda a cada renderização',
          'Roda apenas na montagem e desmontagem',
          'Nunca roda',
          'Roda apenas quando props mudam',
        ],
        correctAnswer: 1,
        explanation: 'Array vazio significa que o effect roda apenas uma vez na montagem (e cleanup na desmontagem).',
      },
      {
        id: '3',
        question: 'Como passar dados de pai para filho no React?',
        options: ['state', 'props', 'context', 'refs'],
        correctAnswer: 1,
        explanation: 'Props são a forma padrão de passar dados de componentes pai para filhos.',
      },
      {
        id: '4',
        question: 'Qual hook usar para efeitos colaterais?',
        options: ['useState', 'useEffect', 'useMemo', 'useCallback'],
        correctAnswer: 1,
        explanation: '`useEffect` é usado para efeitos colaterais como fetch, subscriptions, timers.',
      },
      {
        id: '5',
        question: 'O que é o Virtual DOM?',
        options: [
          'Uma cópia do DOM real na memória',
          'Um framework CSS',
          'Um banco de dados',
          'Um tipo de componente',
        ],
        correctAnswer: 0,
        explanation: 'Virtual DOM é uma representação em memória do DOM real para otimizar atualizações.',
      },
    ],
  },
  {
    id: 'typescript-basics',
    title: 'TypeScript Básico',
    description: 'Tipagem estática para JavaScript moderno',
    icon: '🔷',
    color: 'from-blue-600 to-indigo-600',
    timeLimit: 12,
    questions: [
      {
        id: '1',
        question: 'Como declarar uma variável do tipo string em TypeScript?',
        options: ['let name: string = "João"', 'let name = string "João"', 'string name = "João"', 'let name: String = "João"'],
        correctAnswer: 0,
        explanation: 'TypeScript usa anotação de tipo após o nome da variável: `variavel: tipo`.',
      },
      {
        id: '2',
        question: 'O que o tipo `unknown` representa?',
        options: ['Qualquer valor', 'Nenhum valor', 'Valor desconhecido (type-safe)', 'Erro de tipo'],
        correctAnswer: 2,
        explanation: '`unknown` é o tipo seguro para "qualquer valor" - exige verificação de tipo antes de uso.',
      },
      {
        id: '3',
        question: 'Qual a diferença entre `interface` e `type`?',
        options: [
          'Nenhuma, são iguais',
          'interface permite declaration merging',
          'type é mais rápido',
          'interface só funciona com classes',
        ],
        correctAnswer: 1,
        explanation: 'Interfaces suportam declaration merging (fusão de declarações), types não.',
      },
      {
        id: '4',
        question: 'Como tornar uma propriedade opcional em uma interface?',
        options: ['prop?: string', 'prop: string?', 'optional prop: string', 'prop = string'],
        correctAnswer: 0,
        explanation: 'O `?` após o nome da propriedade a torna opcional.',
      },
      {
        id: '5',
        question: 'O que são Generics em TypeScript?',
        options: [
          'Tipos genéricos para código reutilizável',
          'Variáveis globais',
          'Funções built-in',
          'Comentários de tipo',
        ],
        correctAnswer: 0,
        explanation: 'Generics permitem criar componentes reutilizáveis que trabalham com múltiplos tipos.',
      },
    ],
  },
  {
    id: 'css-layout',
    title: 'CSS Layout Moderno',
    description: 'Flexbox, Grid e técnicas modernas de layout',
    icon: '🎨',
    color: 'from-pink-500 to-purple-500',
    timeLimit: 10,
    questions: [
      {
        id: '1',
        question: 'Qual propriedade define o eixo principal no Flexbox?',
        options: ['flex-direction', 'justify-content', 'align-items', 'flex-wrap'],
        correctAnswer: 0,
        explanation: '`flex-direction` define a direção do eixo principal (row, column, etc).',
      },
      {
        id: '2',
        question: 'No CSS Grid, o que `fr` significa?',
        options: ['Fixed ratio', 'Fraction', 'Flex ratio', 'Full width'],
        correctAnswer: 1,
        explanation: '`fr` (fraction) representa uma fração do espaço disponível no grid.',
      },
      {
        id: '3',
        question: 'Como centralizar um elemento horizontal e verticalmente com Flexbox?',
        options: [
          'justify-content: center; align-items: center',
          'text-align: center; vertical-align: middle',
          'margin: 0 auto; display: flex',
          'position: absolute; top: 50%; left: 50%',
        ],
        correctAnswer: 0,
        explanation: 'Flexbox torna o centramento simples com `justify-content` (eixo principal) e `align-items` (eixo cruzado).',
      },
      {
        id: '4',
        question: 'Qual propriedade cria espaçamento entre itens do grid?',
        options: ['grid-gap', 'gap', 'grid-spacing', 'grid-margin'],
        correctAnswer: 1,
        explanation: '`gap` (ou `row-gap`/`column-gap`) define o espaçamento entre células do grid.',
      },
      {
        id: '5',
        question: 'O que `align-self` faz em um flex item?',
        options: [
          'Alinha todos os itens',
          'Alinha apenas esse item no eixo cruzado',
          'Alinha o container',
          'Define o tamanho do item',
        ],
        correctAnswer: 1,
        explanation: '`align-self` sobrescreve `align-items` do container para um item específico.',
      },
    ],
  },
  {
    id: 'git-basics',
    title: 'Git Essencial',
    description: 'Comandos e fluxo de trabalho com Git',
    icon: '📦',
    color: 'from-orange-500 to-red-500',
    timeLimit: 8,
    questions: [
      {
        id: '1',
        question: 'Qual comando cria um novo repositório Git?',
        options: ['git new', 'git create', 'git init', 'git start'],
        correctAnswer: 2,
        explanation: '`git init` inicializa um novo repositório Git no diretório atual.',
      },
      {
        id: '2',
        question: 'O que `git commit -m "mensagem"` faz?',
        options: [
          'Envia para o remoto',
          'Cria um commit com mensagem',
          'Mostra histórico',
          'Cria branch',
        ],
        correctAnswer: 1,
        explanation: 'Cria um novo commit com a mensagem especificada na flag `-m`.',
      },
      {
        id: '3',
        question: 'Como ver o status dos arquivos?',
        options: ['git status', 'git show', 'git log', 'git diff'],
        correctAnswer: 0,
        explanation: '`git status` mostra arquivos modificados, staged e untracked.',
      },
      {
        id: '4',
        question: 'Qual comando alterna entre branches?',
        options: ['git branch', 'git switch', 'git checkout', 'switch e checkout funcionam'],
        correctAnswer: 3,
        explanation: 'Tanto `git checkout <branch>` quanto `git switch <branch>` funcionam (switch é mais novo).',
      },
      {
        id: '5',
        question: 'O que `git pull` faz?',
        options: [
          'Envia commits locais',
          'Baixa e mescla commits do remoto',
          'Deleta branch remota',
          'Mostra diferenças',
        ],
        correctAnswer: 1,
        explanation: '`git pull` = `git fetch` + `git merge` - baixa e integra mudanças do remoto.',
      },
    ],
  },
]

export default function QuestionariosPage() {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [timerActive, setTimerActive] = useState(false)

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setTimeLeft((quiz.timeLimit || 10) * 60)
    setTimerActive(true)
  }

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }))
  }

  const nextQuestion = () => {
    if (currentQuestion < (selectedQuiz?.questions.length || 0) - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const finishQuiz = () => {
    setShowResults(true)
    setTimerActive(false)
  }

  const restartQuiz = () => {
    if (selectedQuiz) {
      startQuiz(selectedQuiz)
    }
  }

  const goBack = () => {
    setSelectedQuiz(null)
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setTimerActive(false)
  }

  // Timer effect
  useState(() => {
    let interval: NodeJS.Timeout
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    } else if (timeLeft === 0 && timerActive) {
      finishQuiz()
    }
    return () => clearInterval(interval)
  })

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const calculateScore = () => {
    if (!selectedQuiz) return 0
    return selectedQuiz.questions.filter(
      (q) => answers[q.id] === q.correctAnswer
    ).length
  }

  if (!selectedQuiz) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            🧠 Questionários Interativos
          </h1>
          <p className="text-muted-foreground text-lg">
            Teste seus conhecimentos e aprenda com explicações detalhadas
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startQuiz(quiz)}>
              <div className={`p-6 bg-gradient-to-br ${quiz.color} text-white`}>
                <div className="text-4xl mb-2">{quiz.icon}</div>
                <h3 className="text-xl font-bold">{quiz.title}</h3>
                <p className="text-white/80 text-sm mt-1">{quiz.description}</p>
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Brain className="w-4 h-4" />
                  <span>{quiz.questions.length} perguntas</span>
                  <Separator className="h-4 w-px bg-muted" />
                  <Clock className="w-4 h-4" />
                  <span>{quiz.timeLimit} min</span>
                </div>
                <Button className="w-full gap-2" onClick={(e) => { e.stopPropagation(); startQuiz(quiz) }}>
                  <Play className="w-4 h-4" />
                  Iniciar Quiz
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const question = selectedQuiz.questions[currentQuestion]
  const userAnswer = answers[question.id]
  const isCorrect = userAnswer === question.correctAnswer
  const progress = ((currentQuestion + 1) / selectedQuiz.questions.length) * 100

  if (showResults) {
    const score = calculateScore()
    const percentage = Math.round((score / selectedQuiz.questions.length) * 100)

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" onClick={goBack} className="gap-1 justify-start">
          <ChevronLeft className="w-4 h-4" />
          Voltar aos Quizzes
        </Button>

        <Card className="text-center">
          <CardContent className="p-8">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${percentage >= 70 ? 'bg-green-500/20' : percentage >= 50 ? 'bg-yellow-500/20' : 'bg-red-500/20'}`}>
              <Trophy className={`w-12 h-12 ${percentage >= 70 ? 'text-green-500' : percentage >= 50 ? 'text-yellow-500' : 'text-red-500'}`} />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Quiz Concluído!</h2>
            <div className="text-5xl font-bold text-primary mb-2">{score}/{selectedQuiz.questions.length}</div>
            <div className="text-xl text-muted-foreground mb-6">{percentage}% de acerto</div>

            <div className="w-full max-w-xs mx-auto mb-6">
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button onClick={restartQuiz} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Tentar Novamente
              </Button>
              <Button variant="outline" onClick={goBack} className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Outros Quizzes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revisão das Respostas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedQuiz.questions.map((q, i) => {
              const ua = answers[q.id]
              const correct = ua === q.correctAnswer
              return (
                <div key={q.id} className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Q{i + 1}</span>
                    <span className={cn('text-sm font-medium', correct ? 'text-green-500' : 'text-red-500')}>
                      {correct ? <CheckCircle className="w-4 h-4 inline" /> : <XCircle className="w-4 h-4 inline" />}
                    </span>
                  </div>
                  <p className="font-medium text-foreground mb-2">{q.question}</p>
                  <div className="space-y-1 ml-4">
                    {q.options.map((opt, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'text-sm p-2 rounded',
                          idx === q.correctAnswer && 'bg-green-500/20 text-green-700 dark:text-green-300',
                          idx === ua && idx !== q.correctAnswer && 'bg-red-500/20 text-red-700 dark:text-red-300'
                        )}
                      >
                        {idx === q.correctAnswer && <CheckCircle className="w-3 h-3 inline mr-1" />}
                        {idx === ua && idx !== q.correctAnswer && <XCircle className="w-3 h-3 inline mr-1" />}
                        {opt}
                      </div>
                    ))}
                  </div>
                  {q.explanation && (
                    <p className="mt-2 text-sm text-muted-foreground italic">
                      💡 {q.explanation}
                    </p>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={goBack}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 text-center">
          <h2 className="font-semibold text-foreground">{selectedQuiz.title}</h2>
          <p className="text-sm text-muted-foreground">Pergunta {currentQuestion + 1} de {selectedQuiz.questions.length}</p>
        </div>
        <div className="w-10" />
      </div>

      {/* Timer */}
      <Card className={cn('border-primary', timeLeft < 60 && 'border-red-500 animate-pulse')}>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-2xl font-mono font-bold text-foreground tabular-nums">
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(timeLeft / ((selectedQuiz.timeLimit || 10) * 60)) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">{question.question}</h3>
          <RadioGroup value={userAnswer?.toString()} onValueChange={(v) => handleAnswer(question.id, parseInt(v))}>
            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <div key={idx} className="relative">
                  <RadioGroupItem value={idx.toString()} className="peer" />
                  <label
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
                      userAnswer === idx
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                      userAnswer === idx ? 'border-primary bg-primary' : 'border-border'
                    )}>
                      {userAnswer === idx && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-foreground">{option}</span>
                  </label>
                </div>
              ))}
            </div>
          </RadioGroup>

          {question.explanation && userAnswer !== undefined && (
            <div className={cn('mt-4 p-4 rounded-lg', isCorrect ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20')}>
              <div className="flex items-start gap-2">
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-medium">{isCorrect ? 'Correto!' : 'Incorreto'}</p>
                  <p className="text-sm text-muted-foreground mt-1">{question.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={prevQuestion} disabled={currentQuestion === 0} className="gap-1">
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>

        <div className="flex gap-1">
          {selectedQuiz.questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQuestion(i)}
              className={cn(
                'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                i === currentQuestion
                  ? 'bg-primary text-primary-foreground'
                  : answers[selectedQuiz.questions[i].id] !== undefined
                  ? 'bg-green-500/20 text-green-500'
                  : 'bg-muted hover:bg-accent'
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {currentQuestion === selectedQuiz.questions.length - 1 ? (
          <Button onClick={finishQuiz} className="gap-1" disabled={Object.keys(answers).length < selectedQuiz.questions.length}>
            Finalizar
            <CheckCircle className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={nextQuestion} className="gap-1">
            Próximo
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}