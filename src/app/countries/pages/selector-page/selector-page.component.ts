import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { CountriesService } from '../../services/countries.service';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrl: './selector-page.component.css'
})
export class SelectorPageComponent implements OnInit{

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService,
  ) {}

  public regions: Region[] = [];
  public countriesByRegion: SmallCountry[] = []

  public myForm: FormGroup = this.fb.group({
    region: ["", Validators.required],
    country: ["", Validators.required],
    borders: ["", Validators.required]
  })

  ngOnInit(): void {
    this.regions = this.countriesService.getRegions();
    this.onRegionChanged();
  }

  onRegionChanged(): void {
    this.myForm.get('region')!.valueChanges.
    pipe(
      tap(() => this.myForm.get('country')?.setValue("")),
      switchMap(region => this.countriesService.getCountries(region))
    )
    .subscribe( response => {
      this.countriesByRegion = response;
      console.log(this.countriesByRegion, "countries");
      /* this.myForm.get('country')?.setValue("") */
    })

  }


}
