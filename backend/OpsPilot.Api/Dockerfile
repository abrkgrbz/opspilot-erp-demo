FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["OpsPilot.Api.csproj", "./"]
RUN dotnet restore "OpsPilot.Api.csproj"
COPY . .
RUN dotnet publish "OpsPilot.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "OpsPilot.Api.dll"]
