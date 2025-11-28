<script setup lang="ts">
import Corsa from '~/components/Corsa.vue';
const extra1 =[
  {label: "ID utente", Number: "12345"},
  {label: "ID vettore", Number: "54321"}
]
const extra2 =[
  {label: "ID utente", Number: "12345"},
]
const extra3 =[
  {label: "targa veicolo", Number: "RF132DF"},
  {label: "ID utente", Number: "12345"}
]
</script>

<template>
  <div>
    <Corsa 
      partenza="Via Rosmini"
      arrivo="Via Francoforte" 
      :data="new Date('2025-03-12T15:00')" 
      :stimaKm="12.5"  
      :extra="extra1" />
  </div>
  <div>
    <Corsa 
      partenza="Via Rosmini" 
      arrivo="Via Francoforte" 
      :data="new Date('2025-03-12T15:00')" 
      :stimaKm="12.5"  
      :extra="extra2" />
  </div>
  <div>
    <Corsa 
      partenza="Via Rosmini" 
      arrivo="Via Francoforte" 
      :data="new Date('2025-03-12T15:00')" 
      :stimaKm="12.5"  
      :extra="extra3" />
  </div>
  <div>
    <Corsa 
      partenza="Via Rosmini" 
      arrivo="Via Francoforte" 
      :data="new Date('2025-03-12T15:00')" 
      :stimaKm="12.5"  
      :extra="extra1" />
  </div>
</template>

<style scoped></style>
