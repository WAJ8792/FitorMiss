Rails.application.routes.draw do
  root "static_pages#root"

  resources :users, only: [:create, :show]
  resources :reservations, only: [:create, :show]
end
