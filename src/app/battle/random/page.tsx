'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import styles from '@/styles/layout.module.css'
import { Dice3 } from 'lucide-react'

type Deck = {
  id: string
  deck_name: string
}

type MatchResult = {
  player_deck: Deck
  solo_battle: {
    difficulty: string
    expansion: string
    deck: string
  }
}

export default function RandomBattlePage() {
  const [match, setMatch] = useState<MatchResult | null>(null)
  const [error, setError] = useState('')

  const solo_battles = {
    Beginner: {
      "Secluded Springs": ["Fletchinder", "Poliwhirl", "Elektrik"],
      "Wisdom of Sea and Sky": ["Bayleef", "Quilava", "Croconaw"],
      "Eevee Grove": ["Steenee", "Torracat", "Brionne"],
      "Extradimensional Crisis": ["Luxio", "Korokorok", "Lairon"],
      "Celestial Guardians": ["Dartix", "Torracat", "Brionne"],
      "Genetic Apex": ["Ivysaur", "Charmeleon", "Wartortle", "Heliolisk", "Swoobat", "Grapploct", "Nidorina & Nidorino"],
    },
    Intermediate: {
      "Secluded Springs": ["Sunflora", "Talonflame", "Milotic", "Elektross", "Latios & Latias", "Donphan"],
      "Wisdom of Sea and Sky": ["Meganium", "Entei", "Suicune", "Raiku", "Togekiss", "Mamoswine", "Tyranitar", "Scizor", "Porygon-Z"],
      "Eevee Grove": ["Leafeon", "Flareon", "Vaporeon & Glaceon", "Jolteon", "Espeon & Sylveon", "Umbron", "Melmetal"],
      "Extradimensional Crisis": ["Decidueye", "Zeraora", "Neganadel", "Stakataka", "Stoutland"],
      "Celestial Guardians": ["Alolan Exeggutor", "Turtonator", "Alolan Ninetails", "Alolan Golem", "Necrozma", "Lycanroc", "Alolan Persian", "Alolan Dugtrio"],
      "Triumphant Light": ["Carnivine", "Abomasnow", "Tyranitar", "Magnezone"],
      "Spacetime Smackdown": ["Torterra & Shaymin", "Magmortar & Regigigas", "Glaceon & Mamoswine", "Magnezone & Electivire", "Togekiss & Giratina", "Rampardos & Rhyperior", "Darkrai & Regigigas", "Bastiodon & Heatran"],
      "Genetic Apex": ["Venusaur & Exeggutor", "Charizard & Arcanine", "Blastoise & Gyarados", "Magneton & Elektross", "Alakazam & Mewtwo", "Golem & Machamp", "Nidoking & Muk"]
    },
    Advanced: {
      "Secluded Springs": ["Jumpluff EX", "Entei EX", "Suicune EX", "Raikou EX", "Latios & Latias", "Poliwrath EX"],
      "Wisdom of Sea and Sky": ["Shuckle EX & Meganium", "Ho-Oh EX & Entei", "Kingdra EX", "Lanturn EX", "Espeon EX", "Donphan", "Umbreon EX", "Scarmory EX & Scizor", "Lugia EX"],
      "Eevee Grove": ["Flareon EX & Eevee EX", "Primarina EX", "Sylveon EX & Eevee EX", "Dragonite EX", "Snorlax EX"],
      "Extradimensional Crisis": ["Buzzwole EX", "Tapu Koko EX", "Lycanroc EX", "Guzzlord EX", "Alolan Dugtrio EX"],
      "Celestial Guardians": ["Decidueye EX", "Inceneroar EX", "Crabominable EX", "Alolan Raichu EX", "Lunala EX", "Passimian EX", "Alolan Muk EX", "Solgaleo EX"],
      "Triumphant Light": ["Leafon EX", "Arceus Ex & Heatran", "Glaceon EX", "Arceus EX & Raichu", "Garchomp EX", "Arceus EX & Crobat", "Probopass EX"],
      "Spacetime Smackdown": ["Yanmega EX", "Infernape EX", "Palkia EX", "Pachirisu Ex", "Mismagius EX", "Gallade EX", "Darkrai EX", "Dialga EX", "Lickilicki EX"],
      "Mythical Island": ["Celebi EX", "Volcarona & Blaine", "Gyarados Ex", "Raichu & Lt. Surge", "Mew EX", "Aerodactyl EX", "Golem & Brock", "Blue & Pidgeot"],
      "Genetic Apex": ["Venusaur EX", "Charizard EX", "Blastoise EX", "Pikachu EX", "Mewtwo EX", "Machamp EX", "Nidoqueen & Nidoking"],
      "Shining Revelry": ["Beedrill EX", "Charizard EX", "Wugtrio EX", "Pikachu EX", "Giratina EX", "Lucario EX", "Paldean Clodsire EX", "Tinkaton EX", "Bibarel EX"]
    },
    Expert: {
      "Secluded Springs": ["Jumpluff EX & Shuckle EX", "Entei EX & Flareon EX", "Suicune EX & Milotic", "Raikou EX & Pikachu EX", "Latios & Latias", "Poliwrath EX & Politoed"],
      "Wisdom of Sea and Sky": ["Shuckle EX & Venusaur EX", "Lugia EX & Ho-Oh EX", "Kingdra EX", "Lanturn EX", "Espeon EX & Sylveon EX", "Donphan EX & Lucario", "Umbreon EX & Darkrai EX", "Scarmory EX & Scizor"],
      "Eevee Grove": ["Tsareena & Buzzwole EX", "Flareon & Flareon EX", "Primarina EX & Pyukumuku", "Sylveon EX & Sylveon"],
      "Extradimensional Crisis": ["Buzzwole EX", "Tapu Koko EX & Pikachu EX", "Lycanroc EX & Passimian EX", "Guzzlord EX & Naganadel", "Alolan Dugtrio EX & Skarmory"],
      "Celestial Guardians": ["Decidueye EX & Lurantis", "Incineroar EX & Moltres EX", "Crabominable EX & Primarina", "Alolan Raichu EX & Orocorio", "Lunala EX & Giratina EX", "Passimian EX & Lucario EX", "Alolan Muk EX & Toxapex", "Solgaleo EX & Excadrill"],
      "Triumphant Light": ["Leafeon EX & Yanmega EX", "Arceus EX & Infernape EX", "Glaceon Ex & Palkia Ex", "Arceus EX & Pachirisu EX", "Garchomp EX & Marshadow", "Arceus EX & Weavile EX", "Probopass EX & Dialga EX"],
      "Spacetime Smackdown": ["Yanmega EX & Exeggutor Ex", "Infernape EX & Rapidash", "Plakia EX & Vaporeon", "Pachirisu EX & Pikachu EX", "Mismagius EX & Gardevoir", "Gallade EX & Lucario", "Darkrai EX & Weavile EX", "Dialga EX & Melmetal"],
      "Mythical Island": ["Venusaur EX & Serperior", "Celebi EX & Serperior", "Volcarona EX & Moltres", "Gyarados EX & Vaporeon", "Raichu & Magneton", "Mew EX & Mewtwo EX", "Aerodactyl EX & Marowak EX", "Blue & Pidgeot EX"],
      "Genetic Apex": ["Venusaur EX & Exeggutor EX", "Charizard EX & Moltres EX", "Starmie EX & Greninja", "Pikachu Ex & Raichu", "Mewtwo EX & Gardevoir", "Machamp EX & Marowak EX"],
      "Shining Revelry": ["Beedrill EX", "Charizard EX", "Wugtrio EX", "Pikachu EX", "Giratina EX", "Lucario EX", "Paldean Clodsire EX", "Tinkaton EX", "Bibarel EX"]
    }
  }

  const generateMatch = async () => {
    setError('')
    setMatch(null)

    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user

    if (!user) {
      setError('You must be logged in.')
      return
    }

    const { data: decks, error } = await supabase
      .from('decks')
      .select('id, deck_name')
      .eq('user_id', user.id)

    if (error || !decks || decks.length === 0) {
      setError('No decks found for this user.')
      return
    }

    const player_deck = decks[Math.floor(Math.random() * decks.length)]
    const difficulties = Object.keys(solo_battles)
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)]
    const expansions = Object.keys(solo_battles[difficulty])
    const expansion = expansions[Math.floor(Math.random() * expansions.length)]
    const options = solo_battles[difficulty][expansion]
    const enemy_deck = options[Math.floor(Math.random() * options.length)]

    setMatch({
      player_deck,
      solo_battle: {
        difficulty,
        expansion,
        deck: enemy_deck,
      },
    })
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
          <Dice3 size={18} style={{ marginRight: 8 }} />
          Generate a Random Match
        </h1>
        <button
          onClick={generateMatch}
          style={{
            padding: '10px 20px',
            borderRadius: 6,
            fontSize: '1rem',
            cursor: 'pointer',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
          }}
        >
          Generate Match
        </button>

        {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}

        {match && (
          <div
            style={{
              marginTop: '2rem',
              padding: '1.5rem',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
              boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
            }}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>
                Your Deck
              </h2>
              <p style={{ fontWeight: '500', fontSize: '1rem', color: '#333' }}>{match.player_deck.deck_name}</p>
            </div>

            <div>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>
                Solo Battle
              </h2>
              <div style={{ lineHeight: '1.8', fontSize: '0.95rem' }}>
                <p><strong>Difficulty:</strong> {match.solo_battle.difficulty}</p>
                <p><strong>Expansion:</strong> {match.solo_battle.expansion}</p>
                <p><strong>Opponent:</strong> {match.solo_battle.deck}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
