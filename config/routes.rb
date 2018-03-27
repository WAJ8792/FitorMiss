Rails.application.routes.draw do
  root "static_pages#root"

  resources :users, only: [:create, :show]
  resources :reservations, only: [:create, :show]
  resources :cards, only: [:create, :update, :destroy]
  resources :charges, only: [:create]
  resources :schedules, only: [:index, :create]
end
