import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EvolutionChainResponse, PokemonResponse, SpeciesResponse } from '../models/pokemon.model';
import { PokemonComponent } from '../pokemon/pokemon.component';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-tab-list-component',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './tab-list-component.component.html',
  styleUrl: './tab-list-component.component.scss'
})
export class TabListComponentComponent implements OnChanges {
  @Input() pokemonData!: PokemonResponse;
  evolutionData?: EvolutionChainResponse;

  constructor( private http: HttpClient) {}

  activeTab: string = 'about';

  selectedTab(tab: string): void {
    this.activeTab = tab;
  }
  getStatPercentage(baseStat: number): number {
    const max = 200;
    return Math.min((baseStat / max) * 100, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['pokemonData'] && this.pokemonData?.species?.url) {
      this.http.get<SpeciesResponse>(this.pokemonData.species.url).subscribe(species => {
        console.log('Species data', species)
        const evoUrl = species.evolution_chain.url;
        console.log('Evolution data', evoUrl)

        this.http.get<EvolutionChainResponse>(evoUrl).subscribe(evolutionData => {
          this.evolutionData = evolutionData;
          console.log('Evolution chain loaded:', this.evolutionData)
        })
      })
    }
  }
}
