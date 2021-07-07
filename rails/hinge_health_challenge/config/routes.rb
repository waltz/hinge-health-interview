# frozen_string_literal: true

Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api do
    resources :hello
  end

  #  root 'hello@index'

  get 'favicon.ico', to: -> { [204, {}, []] }
end
