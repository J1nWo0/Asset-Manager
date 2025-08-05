using AssetManager.API.Applications.Interfaces;
using AssetManager.API.Applications.Services;
using AssetManager.API.Data;
using AssetManager.API.Data.Identity.Extensions;
using AssetManager.API.Data.Identity.Services;

var builder = WebApplication.CreateBuilder(args);

var mongoConnectionString = builder.Configuration.GetConnectionString("DbConnection");
var mongoDatabaseName = builder.Configuration.GetConnectionString("DbName");

builder.Services.AddControllers();
builder.Services.AddScoped<RoleSeederService>();
builder.Services.AddScoped<AssetSeederService>();
builder.Services.AddScoped<IAssetService, AssetService>();
builder.Services.AddScoped<IRentalService, RentalService>();
builder.Services.AddSingleton<MongoDbService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCorsService(builder.Configuration);

builder.Services.AddMongoIdentity(mongoConnectionString!, mongoDatabaseName!);

builder.Services.AddAuthService(builder.Configuration);
builder.Services.AddCustomPolicies();

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IUserService, UserService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var roleSeeder = scope.ServiceProvider.GetRequiredService<RoleSeederService>();
    roleSeeder.SeedRolesAndSuperAdminAsync().Wait();

    var assetSeeder = scope.ServiceProvider.GetRequiredService<AssetSeederService>();
    assetSeeder.SeedAssetsAsync().Wait();
}

app.UseCors("MyCorsPolicy");

app.UseCustomForbiddenResponse();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
