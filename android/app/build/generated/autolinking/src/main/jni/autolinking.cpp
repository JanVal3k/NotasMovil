/**
 * This code was generated by [React Native](https://www.npmjs.com/package/@react-native/gradle-plugin).
 *
 * Do not edit this file as changes may cause incorrect behavior and will be lost
 * once the code is regenerated.
 *
 */

#include "autolinking.h"
#include <rnasyncstorage.h>
#include <safeareacontext.h>
#include <react/renderer/components/safeareacontext/ComponentDescriptors.h>
#include <RNVectorIconsSpec.h>
#include <pagerview.h>
#include <react/renderer/components/pagerview/ComponentDescriptors.h>

namespace facebook {
namespace react {

std::shared_ptr<TurboModule> autolinking_ModuleProvider(const std::string moduleName, const JavaTurboModule::InitParams &params) {
auto module_rnasyncstorage = rnasyncstorage_ModuleProvider(moduleName, params);
if (module_rnasyncstorage != nullptr) {
return module_rnasyncstorage;
}
auto module_safeareacontext = safeareacontext_ModuleProvider(moduleName, params);
if (module_safeareacontext != nullptr) {
return module_safeareacontext;
}
auto module_RNVectorIconsSpec = RNVectorIconsSpec_ModuleProvider(moduleName, params);
if (module_RNVectorIconsSpec != nullptr) {
return module_RNVectorIconsSpec;
}
auto module_pagerview = pagerview_ModuleProvider(moduleName, params);
if (module_pagerview != nullptr) {
return module_pagerview;
}
  return nullptr;
}

std::shared_ptr<TurboModule> autolinking_cxxModuleProvider(const std::string moduleName, const std::shared_ptr<CallInvoker>& jsInvoker) {

  return nullptr;
}

void autolinking_registerProviders(std::shared_ptr<ComponentDescriptorProviderRegistry const> providerRegistry) {
providerRegistry->add(concreteComponentDescriptorProvider<RNCSafeAreaProviderComponentDescriptor>());
providerRegistry->add(concreteComponentDescriptorProvider<RNCSafeAreaViewComponentDescriptor>());
providerRegistry->add(concreteComponentDescriptorProvider<LEGACY_RNCViewPagerComponentDescriptor>());
providerRegistry->add(concreteComponentDescriptorProvider<RNCViewPagerComponentDescriptor>());
  return;
}

} // namespace react
} // namespace facebook