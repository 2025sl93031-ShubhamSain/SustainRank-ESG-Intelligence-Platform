import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import ResultCard from '../components/ResultCard'

export default function FormResultPage() {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state?.result) {
    navigate('/')
    return null
  }

  return (
    <div style={{ height:'100vh', overflow:'hidden', display:'flex', flexDirection:'column', background:'#f8fafc' }}>
      <Header />
      <div style={{ flex:1, display:'flex', marginTop:'68px', overflow:'hidden' }}>
        <ResultCard result={state.result} backPath={state.backPath} />
      </div>
    </div>
  )
}
