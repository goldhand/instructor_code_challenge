require 'sinatra'

get '/' do  # indicate start of block
  File.read('views/index.html')  # points to template relative to current directory
end

get '/favorites' do
  response.header['Content-Type'] = 'application/json'
  File.read('data.json')
end

post '/favorites' do  # POST new data to json
  file = JSON.parse(File.read('data.json'))
  unless params[:name] && params[:oid]  # need to submit name and oid from form
    return 'Invalid Request'
  end  # ends unless statement
  movie = { name: params[:name], oid: params[:oid] }
  file << movie  # shovel appends to file
  File.write('data.json',JSON.pretty_generate(file))
  movie.to_json  # ruby implicitly returns the last statement
end
